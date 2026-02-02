# Launch Checklist – Finish Site Then Market

Use this to get creatorflow365.com fully done, then market.

---

## Must-do before marketing

| Step | What to do | Done |
|------|------------|------|
| 1 | **Deploy latest code** – Push to GitHub (main). Vercel auto-deploys. Wait for “Ready” in Vercel → Deployments. | ☐ |
| 2 | **Stripe webhook** – Stripe Dashboard → Developers → Webhooks. Endpoint: `https://www.creatorflow365.com/api/stripe/webhook`. Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `invoice.payment_failed`. Copy Signing secret → Vercel env `STRIPE_WEBHOOK_SECRET` if new. Redeploy. | ☐ |
| 3 | **Stripe prices** – In Stripe, create/update products so amounts match site: Starter $9, Essential $19, Creator $49, Professional $79, Business $149. Assign those price IDs to Vercel env vars (`STRIPE_PRICE_STARTER`, etc.). | ☐ |
| 4 | **Smoke test** – Sign up → pick a plan → start trial or go to checkout. Log in → Credit Bundles “Buy credits” → pay $5/$10/$20 → confirm credits show (or webhook log). | ☐ |

---

## Optional polish (can do before or after launch)

| Item | Notes |
|------|--------|
| Privacy / Terms | Footer links to “Privacy” and “Terms” currently go to `#`. Add `/privacy` and `/terms` pages when you have copy, or leave as #. |
| 404 page | App has `not-found`; confirm it looks fine. |
| Contact | Contact form or support@ – you have support@ forwarding via ImprovMX. |

---

## Then: market

- Content (blog/social) about CreatorFlow365 and who it’s for.
- Outreach to creators (email, DMs, communities).
- Paid (Meta/Google) or organic (SEO, Product Hunt, etc.) as you prefer.

---

## Quick reference

- **Deploy:** `git push origin main` → Vercel deploys. See `DEPLOY_VERCEL_HOW.md`.
- **DB:** Already set up (users, credits_balance). See `DB_SETUP_HOW.md` if you need to re-run.
- **Stripe env vars:** Already in Vercel. See `VERCEL_STRIPE_ENV_VARS.md`.
- **Credit bundles:** API + webhook + homepage done. See `CREDIT_BUNDLES_SETUP.md`.
