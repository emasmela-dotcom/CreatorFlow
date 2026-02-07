# CreatorFlow – Completion List (Site Functional for Users)

**Scope:** Only what’s needed for the site to work for users. No new features. When this list is done, we call the site complete for v1.

**Later (separate):** Direct posting, engagement inbox, social listening, and other additions are a *next* phase—after this is confirmed done.

---

## 1. Deploy

- [x] Latest code on `main`. Pushed. Vercel build Ready (Production).

---

## 2. Stripe – Webhook

- [x] Stripe Dashboard → Webhooks: endpoint `https://www.creatorflow365.com/api/stripe/webhook`, Active, 7 events.
- [x] Signing secret in Vercel as `STRIPE_WEBHOOK_SECRET` (confirm it’s set; redeploy only if you changed it).

---

## 3. Stripe – Prices

- [x] Price IDs in Vercel: `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_BUSINESS`, `STRIPE_PRICE_AGENCY` (Production).
- [ ] Confirm in Stripe Dashboard that products/prices match site ($9, $19, $49, $79, $149). Then done.
- **Note:** For live payments on www.creatorflow365.com, ensure `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are set for **Production** (you have them for Preview).

---

## 4. Smoke test

- [ ] Sign up → pick a plan → complete checkout or start trial.
- [ ] Dashboard → Credit Bundles → buy $5 (or $10/$20) → confirm credits update (or webhook received in Stripe).

---

## 5. Quick QA

- [ ] Log out and log in again.
- [ ] One full plan checkout and one credit purchase without errors.

---

**Done when:** 1–5 are checked. Site is functional for users. Stop adding to this list; call it quits for v1. Then market (and later, add features like direct posting in a separate phase).
