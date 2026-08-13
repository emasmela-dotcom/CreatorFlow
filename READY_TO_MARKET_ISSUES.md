# Ready to market — look-at list

**What this is:** A list of things that can still go wrong, look unfinished, or over-promise if you market CreatorFlow365 today.

**What this is not:** A promise to build new features. Look first. Fix or hide only what is actually broken or untrue.

**Live site:** https://www.creatorflow365.com  
**Local:** http://localhost:3000

Mark `[x]` only after you (or an agent you told to) **checked the live site or the real account**, not from memory.

**Last checklist update:** 2026-08-13 — caught up from work done in chat + prior `MARKETING_READY.md` verifies. Boxes left open = not verified or not finished.

---

## How to use this

1. Work **one section at a time**.
2. For each item: **look** → decide **true / broken / overstated / later**.
3. Do not advertise anything still marked overstated or broken.
4. **When something is finished or verified, tick it here the same day.** Do not leave the list stale.

---

## 1. Honest offer (biggest market risk)

If ads or the site promise more than the product does, that is the issue.

- [ ] **Pricing feature lists** — Still old bullets on live `/pricing`. Honest rewrite drafted in chat (Starter/Essential/Creator) but **not placed on the site yet**.
- [ ] **Team collaboration** — Still listed on higher plans. Not built. Must remove or “coming later” before ads mention teams.
- [ ] **API access** — Still listed. No public customer API.
- [ ] **White-label** — Still listed. Not built.
- [ ] **“Enhanced / Advanced / Premium / Fastest AI”** — Still on live pricing. Same Groq model for everyone. Must remove from pricing copy.
- [ ] **AI bot call counts** (500 / 1,000 / unlimited) — Live pricing still wrong. Draft caps in chat (25 / 100 / 200 Groq AI Coach) **not on site**, not enforced yet.
- [ ] **“Unlimited everything”** — Still on live pricing. Draft: limit saved originals (numbers agreed in talk, not on site).
- [ ] **Support times** (48hr / 24hr / 6hr / 2hr / dedicated manager) — Live pricing still has stepped times. Draft: keep 48hr across early plans — not placed.
- [ ] **Paid prices on `/pricing`** vs banner **“Free while we build”** — Still mixed. Decision: free-now marketing until checkout intentionally on. Pricing page still shows $.
- [x] **`/ai` page** — Live at https://www.creatorflow365.com/ai (2026-08-11). Groq + llama-3.1-8b-instant + shared capacity wording. Update when models/limits change.

**Section 1 status:** Mostly open. Main polish left = put honest plans on `/pricing` (and matching plan data).

---

## 2. Core product (what a stranger must complete)

If this path fails, do not market.

- [x] Homepage loads (no surprise redirect) — verified earlier (`MARKETING_READY`)
- [x] Sign up (new email) — Eric tested
- [x] Sign in — Eric tested
- [ ] Forgot password (if you offer it — confirm it actually sends mail)
- [x] Documents: create, save **text**, reopen later — Eric tested
- [x] Documents: format for a platform + **Copy** — verified
- [x] Documents: **video attach** (Blob on Vercel) — verified earlier
- [x] Session expired message is clear (not a blank crash) — verified 2026-08-01
- [ ] Stranger test: someone else lands → sign up → save a doc → format → copy

**Section 2 status:** Almost done. Open: forgot-password mail check + stranger test.

---

## 3. AI (AI Coach / Groq)

- [x] `GROQ_API_KEY` on Vercel Production — Eric placed key; earlier live Caption coach verify 2026-08-04 (`MARKETING_READY`). Re-test if coach fails.
- [ ] AI Coach opens on dashboard when signed in — needs a fresh check this week
- [x] One real coach request returns useful text — Caption coach verified 2026-08-04 (re-check if anything breaks)
- [ ] When Groq is down or over daily limit, user sees a **plain** “try later” message (not a crash)
- [x] `/ai` matches what the coach actually uses (Groq / llama-3.1-8b-instant) — page live 2026-08-11
- [ ] Decide later: **per-user daily/monthly cap** so one person cannot burn the shared Groq pool (draft numbers in chat; not built)

**Section 3 status:** Key + `/ai` + prior coach verify done. Open: open-coach UI check, error message, enforce caps.

---

## 4. Social connections (dashboard)

Look at each Connect button. If it fails, do not advertise “post everywhere.”

**Connect worked in earlier session (re-check if anything breaks):**

- [x] Snapchat — connected earlier
- [x] Bluesky — connected earlier
- [x] Mastodon — connected earlier (scopes/token fix)
- [x] Discord — connected earlier
- [x] Telegram — connected earlier (bot token + chat ID)
- [x] Tumblr — connected earlier
- [x] WordPress — connected earlier

**Known problems / not done:**

- [ ] **Reddit** — not connected (app create / captcha / wrong Reddit developer product)
- [ ] **Instagram / Facebook / Threads** — blocked on Meta phone verification
- [ ] **WhatsApp** — no Connections card; also needs Meta
- [ ] After connect: can the user **actually post or schedule**, or only “connected”? Not verified end-to-end. Do not market auto-post until this is checked per platform.

**Section 4 status:** Several connects done. Meta/Reddit/WhatsApp open. Auto-post not proven.

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
- [x] Decide: keep “Free while we build” until checkout is intentionally on — decided in product talk; banner/home still free-now. Do not advertise paid checkout yet.

**Section 5 status:** Free-now decision locked. Paid Stripe path still open.

---

## 6. Trust pages and contact

- [x] Privacy — verified earlier
- [x] Terms — verified earlier
- [x] Support form actually arrives in **apputilitybuilder@gmail.com** — verified earlier
- [x] Footer contact / copyright — verified earlier
- [x] Feedback bubble — verified earlier
- [x] 404 page (bad URL → Page not found + way home) — verified 2026-08-02

**Section 6 status:** Done (prior verifies).

---

## 7. Live site / hosting

- [x] https://www.creatorflow365.com is the real production project
- [x] Push to `main` deploys
- [x] Neon database URL on Vercel Production
- [x] `JWT_SECRET` set
- [x] `RESEND_API_KEY` (mail)
- [x] `BLOB_READ_WRITE_TOKEN` (document video)
- [x] Env URLs = `https://www.creatorflow365.com` (OAuth callbacks match) — set for production; re-check if a connect fails

**Section 7 status:** Done (prior verifies).

---

## 8. Copy and ads (before you post)

- [x] Homepage promise matches Documents (one draft → many platforms) — hero updated 2026-08-13 with save / format / copy + Groq + no per-word
- [x] Do **not** claim every dashboard tool is live AI — rule kept; spot-check before ads
- [x] Do **not** claim all social networks work until section 4 auto-post is true — do not claim all-network posting
- [x] Do **not** run paid ads until you explicitly say so
- [x] One primary button: create free account → signup — on home

**Section 8 status:** Done for free-now wording. Still do not market paid plans or all-network auto-post.

---

## 9. Phone / small screen

- [x] Home — mobile check earlier
- [ ] Sign up / sign in — needs a fresh phone look
- [x] Documents — mobile check earlier
- [ ] `/ai`
- [ ] `/pricing`
- [ ] Dashboard AI coach (readable, can close)

**Section 9 status:** Home + Documents done earlier. Open: signup/signin, `/ai`, `/pricing`, AI coach on phone.

---

## 10. Later (not required for first “free while we build” posts)

- [ ] Stronger AI models (ChatGPT + another well-known AI — planned as higher-plan selling point; then update `/ai`)
- [ ] Per-user AI caps (draft: Starter 25 / Essential 100 / Creator 200 Groq AI Coach — not built)
- [ ] Reddit + Meta family + WhatsApp
- [ ] Paid checkout on
- [ ] Plan feature rewrite on live `/pricing` (in progress in chat — do before charging)
- [ ] Reviews / promo program
- [ ] Public API, teams, white-label — only if you decide to build them (default: remove from pricing, don’t build)

**Product rules locked in talk (not all on site yet):**
- No per-word pricing — ever (differentiator)
- Format to all supported platforms on every plan
- Stronger AI later = higher-plan lever
- Saved originals will have limits (abuse) — numbers TBD on site

---

## Bottom line

**Safe to talk about today (if stranger test still pending, say so):** free account, Documents, format + copy, AI Coach (Groq) with shared capacity, no per-word fees, free while we build.

**Not safe to sell or shout until cleaned:** old plan feature bullets on `/pricing`, teams, API, white-label, “unlimited AI,” all-network auto-post, live paid checkout.

**Next strict tick work:** finish honest plan draft → place on `/pricing` → check off Section 1 items that become true.

When you finish an item, say so — it gets `[x]` the same day.
