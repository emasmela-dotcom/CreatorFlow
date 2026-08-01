# Marketing ready — CreatorFlow365

**Purpose:** Single checklist. Work until every box is checked. **Then** market hard using `MARKETING_BROADCAST_PLACES.md`.

**Home link for all outreach:** https://www.creatorflow365.com  
**Hero pitch:** One draft, many exports. Free account — try Documents workspace.

**How to use:** Agent or Eric marks `[x]` only when **verified on the live site** (not “should work”). Update this file as items complete. Commit + push when this file changes.

**Last updated:** 2026-08-01

---

## Status summary

| Phase | State |
|-------|--------|
| Core product (Documents) | In progress — text save tested good; video needs Blob on Vercel |
| Free-now mode | Live (banner + no checkout push) |
| Paid / Stripe marketing | **Not yet** — do not advertise paid plans until Eric turns billing on |
| Broadcast posting | **Wait** until this file is 100% checked |

---

## A. Product must work (marketing promise = true)

- [x] Homepage loads — no auto-redirect to dashboard
- [x] Taglines on home: “One draft, many exports” + save-original line
- [x] **Documents workspace** live at `/documents`
- [x] Save **text** original (title + content) — Eric tested multiple docs
- [x] Platform format panel + **Copy formatted** (not saved to DB)
- [x] **Video attach** works on live site (Vercel **Blob** store + `BLOB_READ_WRITE_TOKEN` + redeploy)
- [x] Sign up works (Eric tested fresh account)
- [x] Sign in works
- [ ] Session-expired message clear when JWT expires (~1 hour) — retest after long gap
- [ ] Stranger test: Eric watches someone land → sign up → save doc → format → copy (one pass)

---

## B. Site trust (every visitor)

- [x] Sitewide banner: Free while we build. Paid plans with live AI later.
- [x] Privacy page loads
- [x] Terms page loads
- [x] Support form sends to **apputilitybuilder@gmail.com**
- [x] Footer: © CreatorFlow365 + Contact support
- [x] Feedback bubble works
- [ ] 404 / error pages acceptable (quick check)
- [ ] Mobile check on home + Documents (phone or narrow browser)

---

## C. Production / infra (do not market on a broken deploy)

- [x] Live domain: https://www.creatorflow365.com
- [x] Vercel deploys from `main` on push
- [x] Neon `DATABASE_URL` on Vercel Production
- [x] `JWT_SECRET` set
- [x] `RESEND_API_KEY` + Resend domain verified
- [x] **`BLOB_READ_WRITE_TOKEN`** for document videos (Vercel Storage → Blob)
- [ ] Optional AI keys when Eric ready to fund: `GROQ_*`, `XAI_API_KEY`, `OPENAI_API_KEY` (not required for free-now text formatting)

---

## D. Copy honesty (do not over-promise in ads)

- [x] Wording matches truth: user has content → pick platform → formatted copy
- [ ] Do **not** claim every dashboard “tool” is full AI — spot-check before ads mention tools
- [ ] Do **not** advertise paid plan prices until checkout is intentionally live again
- [x] One-line offer ready (see `MARKETING_BROADCAST_PLACES.md` bottom)

---

## E. Free-now marketing prep (before spend)

- [ ] Pick **one** primary CTA everywhere: e.g. “Create free account” → signup → Documents
- [ ] Dashboard nav or home makes **Documents** easy to find (Documents link on home — done; dashboard link — verify)
- [ ] Eric approves a **short demo script** (30 sec): paste → save → Instagram → copy
- [ ] Screenshot or screen recording for posts (optional but helps)

---

## F. When A–E are all checked → start broadcast

Open **`MARKETING_BROADCAST_PLACES.md`** and work table rows from `todo` → `posted` → `done`.

Suggested order:
1. Reddit (value-first posts) — r/SideProject, r/ContentCreators
2. Indie Hackers / Product Hunt (when story is tight)
3. X / LinkedIn (demo clip + link)
4. Rest of list in that file

**Do not** start paid ads until Eric explicitly says so.

---

## G. Later (after free-now traction — not blocking first marketing wave)

- [ ] Turn paid plans + live AI back on when credits funded
- [ ] Stripe live checkout in signup flow again
- [ ] Reviews / promo program (first N creators) — not built
- [ ] Second Neon DB or auto-routing if storage fills — not built
- [ ] Simplify or redirect `/create` to Documents

---

## Agent note

When you complete a item: change `[ ]` → `[x]` here, note date in git commit message, push. When **section A–E** has no open boxes, tell Eric: **“Marketing ready — start broadcast list.”**
