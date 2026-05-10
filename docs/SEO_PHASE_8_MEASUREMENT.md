# Phase 8 — Measure (your steps after deploy)

Do this in **Google Search Console** for property **https://www.creatorflow365.com** (or domain property).

## URLs to watch first (4–8 weeks)

Paste each into **Performance → Pages** filter or track as a group:

- `https://www.creatorflow365.com/`
- `https://www.creatorflow365.com/creator-tools`
- `https://www.creatorflow365.com/ai-caption-writer-instagram-tiktok`
- `https://www.creatorflow365.com/social-media-scheduler-for-creators`
- `https://www.creatorflow365.com/content-creator-analytics-platform`
- `https://www.creatorflow365.com/reviews`
- `https://www.creatorflow365.com/select-plan`
- `https://www.creatorflow365.com/demo`

Same list is declared in code as `SEO_GUIDE_PATHS` + homepage/hub in `src/app/sitemap.ts`.

## What to do each week

1. Sort by **impressions** and **clicks** for those URLs.
2. Pick the **worst** URL (high impressions, low clicks → fix title/description in code; low impressions → content/internal links).
3. Note queries triggering each URL (Performance → Queries → filter by page).

## Rich Results Test (phase 7 follow-through)

After any FAQ or structured-data change, run Google’s **Rich Results Test** on the live URL:

https://search.google.com/test/rich-results  

Enter each guide URL + homepage if FAQ markup is present.

## Iterate

Repeat edits in **this repo** (`src/app/…`, `src/lib/seo/…`), commit, push, wait for recrawl, then compare weeks.
