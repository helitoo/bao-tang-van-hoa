/**
 * Keyword search over artifacts (runs on the server, see lib/serverArtifacts.ts).
 *
 * Accent mode: Vietnamese words collide once accents are removed ("trống"
 * drum / "trong" inside, "rồng" dragon / "rộng" wide), so
 *   - a query typed WITH accents is matched accent-exactly,
 *   - a query typed WITHOUT accents is matched accent-insensitively
 *     ("trong dong" finds "Trống đồng"),
 *   - if an accented query finds nothing (wrong accent typed), it is retried
 *     accent-insensitively.
 *
 * Scoring, per query word:
 *   quality of the best match  x  weight of the field it matched in  x  IDF
 * plus bonuses when consecutive query words appear side by side (phrases) and
 * when the name is / starts with the whole query.
 *
 * Match quality:
 *   same word ............................ 1.00
 *   starts with the LAST query word ...... 0.60  (typing in progress: "trốn")
 *   1 typo (words >= 6 letters) .......... 0.50  ("trongg" -> "trống")
 *   2 typos (words >= 10 letters) ........ 0.35
 *   (typos are counted without accents: "trống" vs "trong" is not a typo)
 *
 * A result must contain every meaningful query word for 1-2 words, two thirds
 * of them for longer queries. Function words typed with accents ("của",
 * "và"...) are optional and weigh little. Results scoring under
 * MIN_RELATIVE_SCORE of the best one are dropped (weak description-only hits
 * when the query clearly names something).
 */

import type { Artifact } from "@/contexts/artifact";
import type { Locale } from "@/lib/lang";
import { getCategoryNames } from "@/lib/consts/categories";

// ------------------------------------------------------------ text helpers
/** Remove Vietnamese (and other Latin) diacritics: "Đồng" -> "Dong". */
export function foldAccents(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFC");
}

function tokenize(s: string): string[] {
  return s
    .normalize("NFC")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

const isNumeric = (w: string) => /^\p{N}+$/u.test(w);

/**
 * Function words: optional in queries and given a low weight. Only matched
 * WITH accents: unaccented they collide with content words ("den" = "đền"
 * temple, "do" = "đồ" object, "trong" = "trống" drum).
 */
const STOPWORDS = new Set([
  "của", "và", "là", "các", "những", "một", "với", "cho", "trong", "tại",
  "ở", "thì", "mà", "này", "được", "bị", "từ", "đến", "về", "như",
  "the", "of", "and", "an", "in", "on", "at", "to", "les", "des", "et",
]);

// ---------------------------------------------------------------- the index
type FieldKey =
  | "name"
  | "short_description"
  | "categories"
  | "location"
  | "author"
  | "artifact_date"
  | "description";

/** How much a match in each field counts. */
const FIELD_WEIGHTS: Record<FieldKey, number> = {
  name: 10,
  short_description: 5,
  categories: 4,
  location: 3,
  author: 2,
  artifact_date: 2,
  // Descriptions are written to carry the searchable keywords, so a match
  // there counts as much as a category match (only the best match per field
  // counts, so a long description is not favoured just for its length).
  description: 4,
};
const FIELDS = Object.keys(FIELD_WEIGHTS) as FieldKey[];

/** Two views of the text: as written ("exact") and without accents ("folded"). */
type Mode = "exact" | "folded";

type IndexedDoc = {
  artifact: Artifact;
  fields: Record<Mode, Record<FieldKey, string[]>>;
  name: Record<Mode, string>;
};

type Vocab = {
  /** word -> number of artifacts containing it */
  docFreq: Map<string, number>;
  words: string[];
};

export type SearchIndex = {
  docs: IndexedDoc[];
  vocab: Record<Mode, Vocab>;
};

function fieldText(a: Artifact, key: FieldKey, locale: Locale): string {
  if (key === "categories") return getCategoryNames(a.categories, locale);
  return (a[key] as string | undefined) || "";
}

export function buildSearchIndex(artifacts: Artifact[], locale: Locale): SearchIndex {
  const df: Record<Mode, Map<string, number>> = { exact: new Map(), folded: new Map() };

  const docs = artifacts.map((artifact) => {
    const exact = {} as Record<FieldKey, string[]>;
    const folded = {} as Record<FieldKey, string[]>;
    const seen: Record<Mode, Set<string>> = { exact: new Set(), folded: new Set() };

    for (const key of FIELDS) {
      const words = tokenize(fieldText(artifact, key, locale));
      exact[key] = words;
      folded[key] = words.map(foldAccents);
      for (const w of exact[key]) seen.exact.add(w);
      for (const w of folded[key]) seen.folded.add(w);
    }
    for (const mode of ["exact", "folded"] as const) {
      for (const w of seen[mode]) df[mode].set(w, (df[mode].get(w) || 0) + 1);
    }
    return {
      artifact,
      fields: { exact, folded },
      name: { exact: exact.name.join(" "), folded: folded.name.join(" ") },
    };
  });

  return {
    docs,
    vocab: {
      exact: { docFreq: df.exact, words: [...df.exact.keys()] },
      folded: { docFreq: df.folded, words: [...df.folded.keys()] },
    },
  };
}

// Reused while the artifact list is the same object: fetchArtifactsServer
// returns the same array across requests as long as the data is unchanged.
const indexCache = new WeakMap<Artifact[], Map<Locale, SearchIndex>>();

export function getSearchIndex(artifacts: Artifact[], locale: Locale): SearchIndex {
  let byLocale = indexCache.get(artifacts);
  if (!byLocale) {
    byLocale = new Map();
    indexCache.set(artifacts, byLocale);
  }
  let index = byLocale.get(locale);
  if (!index) {
    index = buildSearchIndex(artifacts, locale);
    byLocale.set(locale, index);
  }
  return index;
}

// ------------------------------------------------------------- query terms
/** Optimal string alignment distance; returns max + 1 as soon as it exceeds max. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

const Q_EXACT = 1;
const Q_PREFIX = 0.6;
const Q_TYPO_1 = 0.5;
const Q_TYPO_2 = 0.35;
const MIN_RELATIVE_SCORE = 0.08;

type QueryTerm = {
  /** the word in the current mode (accented or folded) */
  key: string;
  optional: boolean;
  idf: number;
  /** vocabulary word -> match quality */
  matches: Map<string, number>;
};

function buildTerms(words: string[], mode: Mode, index: SearchIndex): QueryTerm[] {
  const vocab = index.vocab[mode];
  const n = index.docs.length || 1;

  const terms = words.map((word, i) => {
    const key = mode === "exact" ? word : foldAccents(word);
    const isLast = i === words.length - 1;
    const foldedLen = foldAccents(key).length;

    const matches = new Map<string, number>([[key, Q_EXACT]]);
    if (!isNumeric(key)) {
      const foldedKey = foldAccents(key);
      const maxTypos = foldedLen >= 10 ? 2 : foldedLen >= 6 ? 1 : 0;
      const prefix = isLast && foldedLen >= 3;
      if (maxTypos > 0 || prefix) {
        for (const v of vocab.words) {
          if (v === key) continue;
          if (prefix && v.startsWith(key)) {
            matches.set(v, Math.max(matches.get(v) || 0, Q_PREFIX));
            continue;
          }
          if (maxTypos > 0 && v.length >= 3 && !isNumeric(v)) {
            // Typos are counted on the letters only: a word that differs
            // just by accents ("trống" / "trong") is a different word, not
            // a typo.
            const foldedV = mode === "exact" ? foldAccents(v) : v;
            if (foldedV === foldedKey) continue;
            const dist = editDistance(foldedKey, foldedV, maxTypos);
            if (dist <= maxTypos) {
              const q = dist === 1 ? Q_TYPO_1 : Q_TYPO_2;
              matches.set(v, Math.max(matches.get(v) || 0, q));
            }
          }
        }
      }
    }

    // Rare words weigh more than common ones ("trống" > "đồng")
    const df = vocab.docFreq.get(key) || 0;
    const idf = Math.log(1 + n / (df + 1));
    return { key, optional: STOPWORDS.has(word), idf, matches };
  });

  // A query made only of function words: search them for real
  if (terms.every((t) => t.optional)) for (const t of terms) t.optional = false;
  for (const t of terms) if (t.optional) t.idf *= 0.2;
  return terms;
}

function bestQuality(term: QueryTerm, words: string[]): number {
  let best = 0;
  for (const w of words) {
    const q = term.matches.get(w);
    if (q && q > best) {
      best = q;
      if (best === Q_EXACT) break;
    }
  }
  return best;
}

/** Number of consecutive query word pairs found side by side in `words`. */
function adjacentPairs(terms: QueryTerm[], words: string[]): number {
  let pairs = 0;
  for (let k = 0; k + 1 < terms.length; k++) {
    for (let i = 0; i + 1 < words.length; i++) {
      if (terms[k].matches.has(words[i]) && terms[k + 1].matches.has(words[i + 1])) {
        pairs++;
        break;
      }
    }
  }
  return pairs;
}

export type ScoredArtifact = { artifact: Artifact; score: number };

function runSearch(words: string[], mode: Mode, index: SearchIndex): ScoredArtifact[] {
  const terms = buildTerms(words, mode, index);
  const required = terms.filter((t) => !t.optional).length;
  const minRequired = required <= 2 ? required : Math.ceil(required * (2 / 3));
  const sumIdf = terms.reduce((s, t) => s + t.idf, 0);
  const phrase = terms.map((t) => t.key).join(" ");

  const results: ScoredArtifact[] = [];
  for (const doc of index.docs) {
    const fields = doc.fields[mode];
    let score = 0;
    let matchedRequired = 0;

    for (const term of terms) {
      let best = 0;
      for (const key of FIELDS) {
        const q = bestQuality(term, fields[key]);
        if (q > 0) best = Math.max(best, q * FIELD_WEIGHTS[key]);
      }
      if (best > 0) {
        score += best * term.idf;
        if (!term.optional) matchedRequired++;
      }
    }
    if (score === 0 || matchedRequired < minRequired) continue;

    // Phrase bonus: query words next to each other, in the best field
    if (terms.length > 1) {
      let bonus = 0;
      for (const key of FIELDS) {
        const pairs = adjacentPairs(terms, fields[key]);
        if (pairs > 0) bonus = Math.max(bonus, (pairs / (terms.length - 1)) * FIELD_WEIGHTS[key]);
      }
      score += bonus * sumIdf * 0.6;
    }

    // The name is exactly the query, or starts with it
    const name = doc.name[mode];
    if (name === phrase) score += FIELD_WEIGHTS.name * sumIdf;
    else if (name.startsWith(phrase + " ")) score += FIELD_WEIGHTS.name * sumIdf * 0.4;

    results.push({ artifact: doc.artifact, score });
  }
  return results;
}

/**
 * Matching artifacts, best first, with a relevance score normalized to 0..1
 * (1 = best result of this query).
 */
export function searchArtifacts(
  query: string,
  artifacts: Artifact[],
  locale: Locale,
): ScoredArtifact[] {
  const words = tokenize(query);
  if (words.length === 0) return artifacts.map((artifact) => ({ artifact, score: 1 }));

  const index = getSearchIndex(artifacts, locale);
  const typedAccents = words.some((w) => foldAccents(w) !== w);

  let results = runSearch(words, typedAccents ? "exact" : "folded", index);
  if (results.length === 0 && typedAccents) results = runSearch(words, "folded", index);
  if (results.length === 0) return [];

  results.sort((a, b) => b.score - a.score);
  const top = results[0].score;
  return results
    .map((r) => ({ artifact: r.artifact, score: r.score / top }))
    .filter((r) => r.score >= MIN_RELATIVE_SCORE);
}
