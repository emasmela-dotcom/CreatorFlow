# Agent catch-up — CreatorFlow365

**Read this first in every new Cursor chat.**  
**Workspace:** `/Users/ericmasmela/CreatorFlow`  
**Live site:** https://www.creatorflow365.com  
**Owner:** Eric (TBI 1997 — short plain answers, one thing at a time, do not overload)

Do **not** mix other repos (ToolMarket, CareConnect, ReadAI, etc.) unless Eric **names** them.

---

## What we are building (product truth)

**Core idea:** *One draft, many exports.*

1. User **already has** content (text and optionally video).
2. User saves **one original** (title + content + optional video) — **not** a pile of formatted copies.
3. User picks a **platform** (Instagram, X, YouTube, etc.) and gets a **live formatted preview** to copy.
4. Formatted output is **never saved** to the database.

**Taglines (use everywhere):**
- **One draft, many exports.**
- **Save your original once. Format for any platform when you need it — nothing extra gets saved.**

**Main workspace:** `/documents` — not Create, not Dashboard overview.

---

## Business mode right now (Aug 2026)

- **Free while we build.** Sitewide banner: *Free while we build. Paid plans with live AI later.*
- Pricing is **hidden / soft** on the site. Stripe code **stays in repo** but is not pushed in the user flow.
- Do **not** charge or push checkout until Eric funds AI credits and says turn billing on.
- Marketing angle for now: **free account**, try Documents workspace, no credit card.

---

## Kimi workflow (Eric + outside AI)

Eric gets **full code from Kimi**, not from Cursor building whole features.

1. Agent gives a **paste block** — always start with `PASTE_TO_KIMI_RULES.txt` (repo root).
2. Eric pastes into Kimi, brings **complete files** back.
3. Agent **places** into real files — **small glue only**. Do **not** drop in Kimi full-page rewrites of homepage, dashboard, layout, signup, signin.
4. Verify → commit + push `main` when Eric asks or after significant placed work.

**Kimi must NOT:**
- Replace whole `src/app/page.tsx`, `layout.tsx`, `dashboard/page.tsx`, signup, signin
- Switch to next-auth or shadcn
- Invent new design systems

**Kimi must match stack:**
- JWT: `localStorage` key **`token`**, `Authorization: Bearer <token>`
- Sign-in route: **`/signin`** (not `/login`)
- DB: `import { db } from '@/lib/db'`, `db.execute({ sql, args })`
- Auth server: `verifyAuth` from `@/lib/auth`
- Colors: **Gorgeous Earth** via `optimist-*` / `sage-*` in `src/app/globals.css`

Other paste files on git: `PASTE_THIS_TO_KIMI_DropCredits.txt`, `PASTE_TO_KIMI_RULES.txt`

---

## Cursor agent rules (Eric enforces)

1. **Only act on what Eric explicitly asks.** Questions → answer only, no edits.
2. **No full app code from Cursor** — Kimi paste + place/glue (see above).
3. **No unsolicited polish**, other projects, or invented features.
4. **Do not call “done”** until verified on the **live** site (or honest blocker named).
5. **Do not burn usage** (Resend sends, paid APIs, browser automation) without Eric approving that action.
6. **Keep replies short.** If Eric says too much — shorten immediately.
7. **Commit + push** when Eric asks, or after significant site work he requested.
8. **Color scheme locked** — Gorgeous Earth. Do not revert to purple unless Eric asks.

---

## What is live and working (verified in recent sessions)

| Area | Status |
|------|--------|
| Home | https://www.creatorflow365.com — product promise + tagline box + Documents nav link |
| **Documents workspace** | `/documents` — save original (text), platform format panel, copy formatted, doc list |
| **Video on Documents** | Attach → upload to Vercel Blob → save with doc. Needs **`BLOB_READ_WRITE_TOKEN`** on Vercel |
| Sign up / sign in | Eric tested fresh signup after DB user clear. JWT expires **~1 hour** → “Session expired” on Documents |
| Support form | `/support` → **apputilitybuilder@gmail.com** (Resend + domain verified) |
| Footer | © CreatorFlow365 + Contact support on all pages |
| Feedback bubble | Sitewide |
| Early access banner | Free while we build |
| AI layer | `src/lib/ai/llm.ts` — Groq → Grok (xAI) → OpenAI; no keys = template fallback |
| `formatForPlatform` | `src/lib/formatForPlatform.ts` — used by Documents |

---

## Honest gaps (do not lie about these)

- **Create page** (`/create`) still has old post limits, schedule/publish, “0 posts remaining” — not the main workspace anymore.
- **Game-changer / category tools** — many are shells, templates, or coming soon. Do not claim full competitive AI without checking.
- **Reviews promo** (first 10 creators, etc.) — discussed, **not built**.
- **Multi-Neon DB failover** — discussed for free-tier capacity, **not built**. App uses one `DATABASE_URL`.
- **Stripe live checkout** — sleeping until Eric turns paid mode on.
- **Video test** — Eric may not have a short clip; text-only Documents flow is enough to prove core product.

---

## Storage architecture

| What | Where |
|------|--------|
| Users, document **text**, app rows | **Neon** PostgreSQL (`DATABASE_URL` on Vercel) |
| Document **videos** | **Vercel Blob** (`@vercel/blob`, `BLOB_READ_WRITE_TOKEN`) |
| Formatted platform copy | **Not stored** — preview only |

Neon free basic is small. Extra Neon projects for failover = possible later (manual switch or future code). Videos do **not** fill Neon.

---

## Key URLs

| Page | URL |
|------|-----|
| Home | https://www.creatorflow365.com |
| **Documents (workspace)** | https://www.creatorflow365.com/documents |
| Sign up | https://www.creatorflow365.com/signup |
| Sign in | https://www.creatorflow365.com/signin |
| Dashboard | https://www.creatorflow365.com/dashboard |
| Create (legacy) | https://www.creatorflow365.com/create |
| Support | https://www.creatorflow365.com/support |

---

## Key files

| File | Purpose |
|------|---------|
| `src/app/documents/page.tsx` | Main workspace UI |
| `src/lib/formatForPlatform.ts` | Platform formatting rules |
| `src/app/api/documents/route.ts` | Save/list/delete documents + video columns |
| `src/app/api/documents/upload/route.ts` | Video upload → Blob |
| `src/app/page.tsx` | Homepage (surgical edits only) |
| `src/app/layout.tsx` | Global shell + banner + footer |
| `src/components/EarlyAccessBanner.tsx` | Free-while-we-build banner |
| `src/lib/ai/llm.ts` | AI provider chain |
| `src/app/globals.css` | Locked Gorgeous Earth palette |
| `PASTE_TO_KIMI_RULES.txt` | Paste before every Kimi task |
| `MARKETING_READY.md` | Master checklist until we market hard |
| `MARKETING_BROADCAST_PLACES.md` | Where to post after marketing ready |

---

## Support / email

- Inbox: **apputilitybuilder@gmail.com**
- Form: `/support`
- Resend domain **creatorflow365.com** verified
- Do not claim mail works without Eric confirming inbox delivery

---

## How to work with Eric next

1. **Question only** → answer, no file changes.
2. **Build request** → Kimi paste (with rules file) → Eric returns code → place + verify → commit/push if asked.
3. **One issue at a time.**
4. Update **`MARKETING_READY.md`** when a marketing-readiness item is truly verified.
5. When **`MARKETING_READY.md`** is all checked → use **`MARKETING_BROADCAST_PLACES.md`** to post everywhere.

---

## Recent git milestones (reference)

- `391cf29` — Documents workspace + format panel + homepage taglines
- `7607717` — Video save on Documents (Vercel Blob)
- `78fa91d` — Marketing broadcast tracker + Kimi drop-credits paste on git

**Last updated:** 2026-08-01
