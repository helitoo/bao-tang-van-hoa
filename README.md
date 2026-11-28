## Overview

The goal of this project is to build _a digital archive for searching information about ancient artifacts in Vietnam_. Support for Vietnamese, English, Chinese, Japanese, and Korean languages.

**Some statistical indicators:**

- Number of requests per day: _About 5k_.
- PageSpeed Insights: SEO 100%, _Best Practices 100%, Accessibility 87%, Performance 94%_ (Desktop)_, Performance 71%_ (Mobile, Performance degradation is primarily due to the limited screen size, which causes the layout to change significantly before and after data fetching), .

## Tech Stack

The website is a Next.js project that reads its data from Supabase (Postgres). Data is fetched on the server only, and the browser never receives the full artifact list: every page gets just the slice it renders (see [Data & caching](#data--caching)). Search is a field-weighted keyword search, built for Vietnamese with or without accents (see [Search algorithm](#search-algorithm)).

**Frontend**:

- Next.js v16 (App Router, React Server Components).

**Data Layer**:

- Supabase (Postgres).

**Deployment**:

- Vercel.

## Data & caching

```
Supabase ──(pages of 400 rows)──> Data Cache (1 h, tagged) ──> server pages ──(one slice)──> browser
```

**1. Reading from Supabase** (`lib/serverArtifacts.ts`)

- The server uses the publishable key. Row Level Security only allows `SELECT`, and on `artifacts` only for `status = 'ACTIVE'`. The env vars have no `NEXT_PUBLIC_` prefix, so the browser never talks to Supabase.
- Artifacts are read in pages of 400 rows (`.range()`), ordered by `id` desc. This stays under PostgREST's 1000-row limit, and the filter matches the partial index `artifacts_public_id_desc_idx`. Categories and collections come in the same query through the junction tables.

**2. Caching layers**

| Layer                                 | Scope                       | Lifetime               | Purpose                                                                                                                                                                                   |
| ------------------------------------- | --------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js Data Cache (`unstable_cache`) | All requests, all instances | 1 hour, or on demand   | One entry per 400-row page (an entry is limited to 2 MB). Supabase is queried a few times per hour at most.                                                                               |
| ISR (`revalidate = 3600`)             | Rendered HTML per locale    | 1 hour                 | Home, collection, map, download and artifact pages are served as static HTML. Artifact and collection pages render on first visit. `/search` stays dynamic because it depends on the URL. |
| React `cache()`                       | One render                  | One request            | Layout, page and `generateMetadata` share a single fetch.                                                                                                                                 |
| Stable array + search index           | Server instance memory      | Until the data changes | `fetchArtifactsServer` returns the same array while the content fingerprint is unchanged, so the search index is built only once (first search ~180 ms, then ~20 ms).                     |
| Last-known-good copy                  | Server instance memory      | Until the next success | Served if Supabase is unreachable.                                                                                                                                                        |

**3. Refreshing after an edit in Supabase**

```bash
curl -X POST https://<site>/api/revalidate -H "Authorization: Bearer $REVALIDATE_SECRET"
# only one dataset: ...?tag=artifacts  or  ?tag=collections
```

This can also be set up as a Supabase Database Webhook on the artifact, collection and junction tables. Without it, data refreshes on its own within an hour.

**4. What each page sends to the browser**

The full list stays on the server. Pages receive only what they display.

| Page                              | Data sent                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Home                              | Total and per-category counts, computed over **all** artifacts; the 12 newest artifacts; the 6 newest collections                          |
| `/search`                         | One page of 32 results, already filtered, ranked and paged. Changing a filter or page updates the URL and the server renders the new page. |
| `/map`                            | Architecture artifacts with coordinates, marker fields only                                                                                |
| `/artifact/[id]`                  | The artifact, plus "same collection" and "similar" cards computed on the server. Unknown ids return 404.                                   |
| `/collection`, `/collection/[id]` | Collection summaries (count + cover) / the collection's cards                                                                              |
| `/saved`                          | Only the saved ids, via `GET /api/artifacts?ids=...`                                                                                       |
| `/download`                       | Nothing; the file is generated by `GET /api/export?format=csv\|txt&fields=...`                                                             |
| Random button                     | One id from `GET /api/random`                                                                                                              |

Cards use `ArtifactSummary`: id, name, short description, categories, image and era. No descriptions or image lists.

## Search algorithm

Implemented in `lib/search.ts` and called from `app/[locale]/search/getFilteredArtifacts.ts`, after the category and color filters. It runs on the server for `/search` and `/api/artifacts?query=`.

**1. Index.** Each artifact's fields are split into words. Every word is stored twice on server process's RAM: as written (lowercase) and without accents (`Đồng` → `dong`). Document frequencies are also stored, for IDF.

**2. Accent mode.** Vietnamese words collide once accents are removed: _trống_ (drum) / _trong_ (inside), _rồng_ (dragon) / _rộng_ (wide).

- Query typed **with** accents → matched accent-exactly.
- Query typed **without** accents → matched accent-insensitively (`trong dong` finds _Trống đồng_).
- If an accented query finds nothing (for example, a wrong accent), it is retried without accents.

**3. Word matching**

| Match                                                  | Quality | Example            |
| ------------------------------------------------------ | ------- | ------------------ |
| Same word                                              | 1.00    | `đồng` = _đồng_    |
| Prefix of the **last** query word (typing in progress) | 0.60    | `trốn` → _trống_   |
| 1 typo, words of 6+ letters                            | 0.50    | `trongg` → _trống_ |
| 2 typos, words of 10+ letters                          | 0.35    |                    |

- Typos use the optimal string alignment distance.
- Typos are counted on letters only: two words that differ only by accents are different words, not typos.
- Numbers only match exactly.

**4. Score**

```
score = Σ over query words ( best match quality × field weight × IDF(word) )
      + phrase bonus   (consecutive query words side by side, in the best field)
      + name bonus     (name equals / starts with the whole query)
```

- Field weights: name 10, short description 5, categories 4, description 4, location 3, author 2, era 2. Descriptions are written to carry searchable keywords, so a description match counts as much as a category match. Only the best match per field counts, so a long description does not score higher just because it is long.
- IDF = `log(1 + N / (df + 1))`: rare words count more than common ones (_trống_ > _đồng_).

**5. Filtering**

- A result must contain every meaningful query word (for 1–2 words) or two thirds of them (for longer queries).
- Function words typed with accents (_của_, _và_, _một_...) are optional and weigh 20%. Unaccented words are never treated as function words, because `den` may be _đền_, `do` may be _đồ_, `trong` may be _trống_.
- Scores are normalized to the best result (= 1). Results under 0.08 are dropped, which removes weak description-only matches when the query clearly names something.

**6. Ordering with colors.** With a color filter, results are sorted by score first. Results within 0.1 of each other are ordered by color distance (redmean formula, similarity threshold 100).

The "similar artifacts" block on the artifact page uses a separate, simpler ranking: shared categories and era, then text similarity (`lib/fuzzySearching.ts`).

## Getting Started

First, load the data into Supabase: run `data/insert.sql` in the Supabase SQL editor, or with `supabase db query --remote -f data/insert.sql`. Regenerate it with `python data/convert_to_sql.py` after changing the CSVs in `data/`. The script also creates the indexes and the read-only RLS policies, and removes any older catch-all `using (true)` read policies.

Then create the file `.env` at the root (see the comments in `.env` for where to find each value):

1. `SUPABASE_URL`: Project URL (`https://<project-ref>.supabase.co`).
2. `SUPABASE_PUBLISHABLE_KEY`: Publishable key (`sb_publishable_...`). Server-only, never exposed to the browser.
3. `REVALIDATE_SECRET`: Random string protecting `POST /api/revalidate`.
4. `NEXT_PUBLIC_SITE_URL`: Public site URL, e.g. `https://btvh.vercel.app`.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
