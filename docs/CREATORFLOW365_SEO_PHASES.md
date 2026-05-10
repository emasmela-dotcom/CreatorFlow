# CreatorFlow365 SEO — sequence (phases 1–8)

Working copy lives **in this repo** (`CreatorFlow`) so it stays next to the code that ships **https://www.creatorflow365.com**. Edit pages under `src/app/` and shared SEO copy under `src/lib/seo/`.

Treat each block as optional to pause between sessions.

## Phase 1 — Lock what you’re optimizing for

1. Pick **5–10 target queries** (real phrases people type) + **one primary page** per query.
2. For each page, write **one sentence**: who it’s for + what outcome they get (this guides answer-first rewrites).

## Phase 2 — On-page structure (easy to skim)

3. Rewrite the **top** of each page: first **2–3 short blocks** answer the main question directly (no fluff).
4. Break the rest into **modules**: clear `h2` / `h3` sections; each section should be skimmable.
5. Add an **FAQ** only where it matches **real** follow-up questions (Search Console, support, Reddit, etc.).

## Phase 3 — Trust signals

6. Add **why we’re credible** in plain language: who runs it, what you’ve shipped, who you help (no hype).
7. Add **proof** where you can: screenshots, numbers, short case blurbs, “what we tested,” changelog-style honesty.
8. **Cite** non-obvious claims: link to reputable sources or label assumptions.

## Phase 4 — Internal linking

9. For each page, add **3–5 internal links** to closely related pages using **descriptive anchor text** (not “click here”).
10. If you have clusters, define **one pillar page** per topic and link child pages into it.

## Phase 5 — Technical / machine-readable

11. **HTML structure**: one clear `<main>`; use `<section>` / `<article>` where it fits your stack.
12. **Images**: meaningful **alt** text (describe the image + context; don’t cram keywords).
13. Fix **broken links** and avoid **redirect chains** on important pages.

## Phase 6 — Metadata & clicks from search

14. **Unique titles** (about ≤60 characters) and **meta descriptions** (about ≤155 characters) per key URL: keyword + clear benefit + light call-to-action.

## Phase 7 — Structured data (only where accurate)

15. Add **FAQ JSON-LD** only if the on-page FAQ matches the markup exactly (no fake Q&A).
16. Check with **Google Rich Results Test** after publishing.

## Phase 8 — Measure

17. In **Google Search Console**: track impressions/clicks for your target URLs for **4–8 weeks**; fix the worst performers first.

---

## URLs already set up in code (good anchors for phases 1–4)

- `/` — homepage (`src/app/page.tsx`)
- `/creator-tools` — hub (`src/app/creator-tools/page.tsx`)
- `/ai-caption-writer-instagram-tiktok`
- `/social-media-scheduler-for-creators`
- `/content-creator-analytics-platform`

Sitemap list: `src/app/sitemap.ts`.
