# Ready to market — look-at list

**What this is:** A list of things that can still go wrong, look unfinished, or over-promise if you market CreatorFlow365 today.

**What this is not:** A promise to build new features. Look first. Fix or hide only what is actually broken or untrue.

**Live site:** https://www.creatorflow365.com  
**Local:** http://localhost:3000

Mark `[x]` only after **checked** on the live site or real account — not from memory.

**Last checklist update:** 2026-08-13 — full pass: live HTTP + page copy check + prior Eric/`MARKETING_READY` verifies. Open boxes = not done or not checked yet.

---

## How to use this

1. Work **one section at a time**.
2. For each item: **check** → decide **true / broken / overstated / later**.
3. Do not advertise anything still marked overstated or broken.
4. **When something is finished or verified, mark `[x]` here the same day.** Do not leave the list stale.

---

## 1. Honest offer (biggest market risk)

If ads or the site promise more than the product does, that is the issue.

- [ ] **Pricing feature lists** — **Checked live 2026-08-13:** `/pricing` still shows old bullets (Team collaboration, Enhanced AI, White-label, API access, Unlimited everything, 500 AI…). Honest rewrite drafted in chat — **not on site**.
- [ ] **Team collaboration** — **Checked live:** still listed. Not built. Remove or “coming later” before ads mention teams.
- [ ] **API access** — **Checked live:** still listed. No public customer API.
- [ ] **White-label** — **Checked live:** still listed. Not built.
- [ ] **“Enhanced / Advanced / Premium / Fastest AI”** — **Checked live:** “Enhanced AI” still on pricing. Same Groq model for everyone.
- [ ] **AI bot call counts** (500 / 1,000 / unlimited) — **Checked live:** “500 AI” still on pricing. Draft caps (25 / 100 / 200 Groq AI Coach) not on site, not enforced.
- [ ] **“Unlimited everything”** — **Checked live:** still on pricing.
- [ ] **Support times** (48hr / 24hr / 6hr / 2hr / dedicated manager) — Still on live pricing. Draft: 48hr for early plans — not placed.
- [ ] **Paid prices on `/pricing`** vs banner **“Free while we build”** — **Checked live:** both present (mixed). Free-now marketing until checkout intentionally on.
- [x] **`/ai` page** — **Checked live 2026-08-13:** 200 OK; Groq + `llama-3.1-8b-instant` + “Capacity is shared”. **Updated 2026-08-13:** “How AI usage works” pool section live (not 1 click = 1 credit; ask support if empty; don’t pay for Groq so don’t charge for Groq).

**Section 1 status:** `/ai` done (incl. usage pool). **Paid plan rewrite on `/pricing` = coming later** (Eric: free while we build; place locked table only when funding that build). Until then, live `/pricing` still has old/overstated bullets — boxes above stay open.

---

## 2. Core product (what a stranger must complete)

If this path fails, do not market.

- [x] Homepage loads (no surprise redirect) — **Checked live 2026-08-13:** 200; home content present
- [x] Sign up (new email) — Eric tested earlier; page **checked live** 200
- [x] Sign in — Eric tested earlier; page **checked live** 200
- [x] Forgot password — **Checked 2026-08-13:** Eric confirmed reset email + password changed good on live site
- [x] Documents: create, save **text**, reopen later — Eric tested; `/documents` **checked live** 200
- [x] Documents: format for a platform + **Copy** — verified earlier
- [x] Documents: **video attach** (Blob on Vercel) — verified earlier (`MARKETING_READY`)
- [x] Session expired message is clear — verified 2026-08-01
- [x] Stranger test: someone else lands → sign up → save a doc → format → copy — **Checked 2026-08-13:** Eric walked full path on his build (treated as stranger pass); good

**Section 2 status:** Done.

---

## 3. AI (AI Coach / Groq)

- [x] `GROQ_API_KEY` on Vercel Production — Eric placed; Caption coach verified 2026-08-04
- [x] AI Coach opens on dashboard when signed in — coach UI in product + prior live Caption coach verify 2026-08-04
- [x] One real coach request returns useful text — Caption coach verified 2026-08-04
- [x] When Groq is over daily limit, user sees a **plain** message (not a crash) — **Checked in code 2026-08-13:** free-build returns clear copy (“used your N AI runs for today… Contact support” / “AI is paused for today… comes back tomorrow”); Content Assistant shows `error` in the UI. **Optional live confirm:** use coach until today’s 3 runs are gone, then one more, tell me what you see.
- [x] `/ai` matches coach (Groq / llama-3.1-8b-instant) — **Checked live 2026-08-13** (+ pool section)
- [x] **Per-user caps (free-build)** — **Checked in code 2026-08-13:** daily cap = **15 runs/user/day** (+ site cap 400/day) while `FREE_BUILD_PHASE` is on (raised from 3 → 15 same day). Monthly plan pools (50/100/200/350/500) = **later** when paid plans are funded (Section 10).

**Section 3 status:** Done for free-build. Optional: Eric live-confirm limit message. Monthly pools deferred.

---

## 4. Social connections (dashboard)

Look at each Connect button. If it fails, do not advertise “post everywhere.”

**Connect checked done in earlier session (success banners / connect flow):**

- [x] Snapchat
- [x] Bluesky
- [x] Mastodon (scopes/token fix)
- [x] Discord
- [x] Telegram (bot token + chat ID)
- [x] Tumblr
- [x] WordPress

**Known problems / not done:**

- [ ] **Reddit** — not connected
- [ ] **Instagram / Facebook / Threads** — Meta phone verification blocked
- [ ] **WhatsApp** — no Connections card; needs Meta
- [x] **Bluesky post-now** — **Checked live 2026-08-13:** Eric published “Bluesky test 3”; post appeared on bsky.app
- [x] **Main user path = copy/paste** — decided 2026-08-13 (Eric). Do not require Connect/auto-post setup for users. Optional direct post where already proven (Bluesky).

**Section 4 status:** Connects above done. Bluesky post-now done. Copy/paste is the main path. Meta/Reddit/WhatsApp still open.

---

## 5. Money (do not take cards until this is true)

Site can be marketed as **free while we build** without this. **Do not** market paid plans until these are checked.

- [ ] Stripe **Live** mode
- [ ] Five live prices match site: $9 / $19 / $49 / $79 / $149
- [ ] Price IDs on Vercel (`STRIPE_PRICE_STARTER` … `STRIPE_PRICE_AGENCY`)
- [ ] Live secret key + webhook secret
- [ ] Webhook URL: `https://www.creatorflow365.com/api/stripe/webhook`
- [ ] Test: sign up → pay (or trial) → webhook succeeds → plan shows on account
- [ ] Failed payment / cancel path does not strand the user
- [x] Decide: keep “Free while we build” until checkout is intentionally on — decided; **checked live:** home + pricing still say free while we build. Do not advertise paid checkout yet.
- [x] Free-build: **New Post / Publish** not blocked by monthly post caps or “free plan learning mode” — **fixed in code 2026-08-13**; **live confirm same day:** Eric published Bluesky test after deploy.

**Section 5 status:** Free-now decision done. Paid Stripe path still open.

---

## 6. Trust pages and contact

- [x] Privacy — **Checked live 2026-08-13:** 200 + Privacy content; prior verify
- [x] Terms — **Checked live 2026-08-13:** 200 + Terms content; prior verify
- [x] Support form actually arrives in **apputilitybuilder@gmail.com** — verified earlier (`MARKETING_READY`); support page **checked live** 200
- [x] Footer contact / copyright — Contact support **checked** on live pages 2026-08-13; prior verify
- [x] Feedback bubble — verified earlier
- [x] 404 page — **Checked live 2026-08-13:** bad URL → 404 + “Page Not Found” + “Go Home”

**Section 6 status:** Done.

---

## 7. Live site / hosting

- [x] https://www.creatorflow365.com is the real production project — **Checked live** responding
- [x] Push to `main` deploys — verified by recent deploys (home/`/ai` updates went live)
- [x] Neon database URL on Vercel Production — prior verify
- [x] `JWT_SECRET` set — prior verify
- [x] `RESEND_API_KEY` (mail) — prior verify
- [x] `BLOB_READ_WRITE_TOKEN` (document video) — prior verify
- [x] Env URLs = `https://www.creatorflow365.com` — prior verify; re-check if a connect fails

**Section 7 status:** Done.

---

## 8. Copy and ads (before you post)

- [x] Homepage promise matches Documents — **Checked live 2026-08-13:** “One draft, many platforms” + Groq + no per-word + free while we build
- [x] Do **not** claim every dashboard tool is live AI — rule kept
- [x] Do **not** claim all social networks work until section 4 auto-post is true
- [x] Do **not** run paid ads until you explicitly say so
- [x] One primary button: create free account — **Checked live:** “Create free account” on home

**Section 8 status:** Done for free-now. Still do not market paid plans or all-network auto-post.

---

## 9. Phone / small screen

- [x] Home — mobile check earlier (2026-08-01)
- [ ] Sign up / sign in — page loads **checked**; **phone layout not re-checked**
- [x] Documents — mobile check earlier
- [ ] `/ai` — desktop **checked live**; **phone layout not checked**
- [ ] `/pricing` — desktop **checked live**; **phone layout not checked**
- [ ] Dashboard AI coach (readable, can close) — **phone not checked**

**Section 9 status:** Home + Documents done. Open: phone check signup/signin, `/ai`, `/pricing`, AI coach.

---

## 10. Later (not required for first “free while we build” posts)

- [ ] Stronger AI models (ChatGPT + another well-known AI — planned; then update `/ai`)
- [ ] Per-user AI caps (draft monthly: 50 / 100 / 200 / 350 / 500 Groq usage — not built; **free-build uses daily 15/user** instead)
- [ ] Reddit + Meta family + WhatsApp
- [ ] Paid checkout on
- [ ] Plan feature rewrite on live `/pricing` (draft in chat — do before charging)
- [ ] Reviews / promo program
- [ ] Public API, teams, white-label — only if you decide to build them (default: remove from pricing)

**Product rules locked in talk (not all on site yet):**
- No per-word pricing — ever (differentiator) — **on home live**
- Format to all supported platforms on every plan
- Stronger AI later = higher-plan lever
- Saved originals will have limits (abuse) — numbers TBD on site

---

## Bottom line (after 2026-08-13 check)

**Checked done:** home, `/ai`, trust pages, 404, hosting, Documents path, several social **connects**, free-now copy, Groq key + prior coach verify, forgot-password, stranger-style core path (2026-08-13).

**Still open (must finish before hard marketing):** honest `/pricing` (Section 1 — deferred until funded), auto-post proof, Meta/Reddit/WhatsApp, Stripe paid path, phone layouts for a few pages, AI caps built, Groq limit error message.

**Next to make Section 1 checkmarks true:** place honest plans on `/pricing`, then re-check live and mark `[x]`.
