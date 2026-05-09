# Launch status check — CreatorFlow365

**Production URL:** `https://www.creatorflow365.com`  
**Prices on site:** Starter **$9**, Essential **$19**, Creator **$49**, Professional **$79**, Business **$149** (see `CURRENT_PLAN_PRICES.md`).

Check off what you have finished:

## Stripe (live)

- [ ] Live mode ON (when accepting real cards)
- [ ] Five monthly recurring prices created (**amounts match table above**)
- [ ] `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_BUSINESS`, `STRIPE_PRICE_AGENCY` set in Vercel Production
- [ ] `STRIPE_SECRET_KEY` (`sk_live_…`)
- [ ] Webhook: `https://www.creatorflow365.com/api/stripe/webhook`
- [ ] Webhook listens for at least: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `invoice.payment_failed`
- [ ] `STRIPE_WEBHOOK_SECRET` set

## Database (Neon)

- [ ] Production database / branch ready in Neon
- [ ] `DATABASE_URL` or `NEON_DATABASE_URL` set on Vercel Production (PostgreSQL URL — app uses `@neondatabase/serverless` in `src/lib/db.ts`)
- [ ] Schema initialized for production (your documented `/api/db/setup` or migration flow)

## Vercel (Production env)

- [ ] `NEXT_PUBLIC_APP_URL` = `https://www.creatorflow365.com`
- [ ] `NEXT_PUBLIC_BASE_URL` = same (OAuth bases)
- [ ] `JWT_SECRET`
- [ ] All Stripe vars above
- [ ] Redeploy after changes

## Domain & DNS

- [ ] `creatorflow365.com` / `www` on correct Vercel project
- [ ] HTTPS works
- [ ] Env URLs match how users open the site

## Smoke tests

- [ ] Sign up → checkout/trial → success path works
- [ ] Stripe Dashboard shows webhook deliveries succeeding
- [ ] User subscription tier updates in DB after checkout

---

Tell me which rows are still unchecked if you want help with the next fix.
