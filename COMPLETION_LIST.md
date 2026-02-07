# CreatorFlow – Completion List (Site Functional for Users)

**Scope:** Only what’s needed for the site to work for users. No new features. When this list is done, we call the site complete for v1.

**Later (separate):** Direct posting, engagement inbox, social listening, and other additions are a *next* phase—after this is confirmed done.

---

## 1. Deploy

- [ ] Latest code on `main`. Vercel builds and deploys. No failed deployments.

---

## 2. Stripe – Webhook

- [ ] Stripe Dashboard → Webhooks: endpoint `https://www.creatorflow365.com/api/stripe/webhook`, events (checkout.session.completed, customer.subscription.created/updated, invoice.payment_failed).
- [ ] Signing secret in Vercel as `STRIPE_WEBHOOK_SECRET`. Redeploy if you changed it.

---

## 3. Stripe – Prices

- [ ] Stripe products/prices match site (Starter $9, Essential $19, Creator $49, Pro $79, Business $149).
- [ ] Price IDs in Vercel match Stripe (`STRIPE_PRICE_STARTER`, etc.).

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
