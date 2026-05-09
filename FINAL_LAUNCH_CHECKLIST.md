# Final Launch Checklist — CreatorFlow365

Use **`PRE_LAUNCH_STATUS.md`** for step-by-step instructions and **`LAUNCH_STATUS_CHECK.md`** for a checkbox pass. This file is a short sanity list aligned with **https://www.creatorflow365.com**, **Neon**, and **Stripe Live**.

## Critical items

### Stripe (Live)

- [ ] Five recurring prices created and mapped to `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_BUSINESS`, `STRIPE_PRICE_AGENCY` (see **`CURRENT_PLAN_PRICES.md`**)
- [ ] `STRIPE_SECRET_KEY` = `sk_live_…`
- [ ] Webhook endpoint: **`https://www.creatorflow365.com/api/stripe/webhook`**
- [ ] Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `invoice.payment_failed`
- [ ] `STRIPE_WEBHOOK_SECRET` = `whsec_…`

### Database (Neon)

- [ ] Production Postgres created in Neon
- [ ] `DATABASE_URL` or `NEON_DATABASE_URL` set in Vercel Production

### Vercel

- [ ] Production env vars set (see **`ENVIRONMENT_VARIABLES.md`**) — including `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_BASE_URL` = `https://www.creatorflow365.com`
- [ ] Redeploy after changing secrets

### Domain

- [ ] `creatorflow365.com` / `www` configured in Vercel and DNS

## Quick verification

1. **`STRIPE_SETUP_VALUES.md`** or Dashboard: all price IDs and webhook secret filled for production.
2. **Smoke test:** signup → choose paid plan → Stripe Checkout → return to dashboard → Stripe Events show successful webhook delivery.

If that passes, you are in good shape to treat the app as live for billing and accounts.
