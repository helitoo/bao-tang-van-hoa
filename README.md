## Overview

The goal of this project is to build _a digital archive for searching information about ancient artifacts in Vietnam_. Support for Vietnamese, English, Chinese, Japanese, and Korean languages.

**Some statistical indicators:**

- Number of requests per day: _About 5k_.
- PageSpeed Insights: SEO 100%, _Best Practices 100%, Accessibility 87%, Performance 94%_ (Desktop)_, Performance 71%_ (Mobile, Performance degradation is primarily due to the limited screen size, which causes the layout to change significantly before and after data fetching), .

## Tech Stack

The website is a Next.js project integrated with the Google ecosystem, reading and writing data from Google Sheets and Google Forms, with manual human validation. Google Workspace is a user-friendly and widely available suite of tools that is secure and easy to integrate, making it suitable for the scale of this project.

The search algorithm _combines Jaccard, N-grams, and inclusion search_. The algorithm has been tested numerous times with various parameters and samples, and the results consistently meet about 80% of user expectations.

**Frontend**:

- Next.js v16 (Originally React).

**Data Layer**:

- Google Sheets API.
- Google Forms.

**Deployment**:

- Vercel.

**Search algorithm**:

- Jaccard similarity.
- N-gram matching.
- Inclusion filtering.

## Getting Started

First, create the file `.env` at the root. This file contains:

1. `NEXT_PUBLIC_SPREADSHEET_ID`: Google Sheet file ID.
2. `NEXT_PUBLIC_SHEET_NAME`: Sheet name.
3. `NEXT_PUBLIC_SHEET_RANGE`: The scope of data to be collected, including the first line, is the header. The header contains the fiels `id`, `name`, `short_description`, `description`, `categories`, `main_image`, `supporting_images`, `author`, `contributor`, `artifact_date`, `public_date`, `location`. Note that `id` is a sequence of numbers; the `main_image` must be a Google Drive URL; and URLs within `supporting_images` are separated by spaces.

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
