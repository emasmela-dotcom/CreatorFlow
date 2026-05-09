# Pre-Launch Status — CreatorFlow365

**Canonical production URL:** `https://www.creatorflow365.com`  
(Code and newer docs use this. Older `.ai` references are outdated.)

## Current Status

Site deploys on **Vercel**. Taking **real money** requires **Stripe Live**, **Neon `DATABASE_URL`**, and **production env vars** below—all verified end-to-end.

---

## Completed (typical)

- App routes, auth (JWT), plans UI, trial/checkout API wiring  
- Stripe webhook handler (`checkout.session.completed`, subscription events, `invoice.payment_failed`)  
- DB layer expects **Neon** (`DATABASE_URL` or `NEON_DATABASE_URL`) — see `src/lib/db.ts`

---

## Critical — before launch

### 1. Stripe (Live mode)

- [ ] Create **5 recurring monthly prices** matching the live site:
  - **Starter** $9 → env `STRIPE_PRICE_STARTER`
  - **Essential** (internal id `growth`) $19 → `STRIPE_PRICE_GROWTH`
  - **Creator** (`pro`) $49 → `STRIPE_PRICE_PRO`
  - **Professional** (`business`) $79 → `STRIPE_PRICE_BUSINESS`
  - **Business** (`agency`) $149 → `STRIPE_PRICE_AGENCY`
- [ ] `STRIPE_SECRET_KEY` = `sk_live_…`
- [ ] Webhook URL: **`https://www.creatorflow365.com/api/stripe/webhook`**  
  Events at minimum: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `invoice.payment_failed`
- [ ] `STRIPE_WEBHOOK_SECRET` = signing secret from that endpoint

### 2. Neon production database

- [ ] Create DB / branch in Neon, copy **connection string**
- [ ] Set `DATABASE_URL` (or `NEON_DATABASE_URL`) on Vercel **Production**
- [ ] Run whatever migration/init your deployment uses so tables exist (`/api/db/setup` or documented script)

### 3. Vercel environment variables (Production)

| Variable | Example / notes |
|----------|------------------|
| `NEXT_PUBLIC_APP_URL` | `https://www.creatorflow365.com` |
| `NEXT_PUBLIC_BASE_URL` | Same as above (OAuth callback bases in places) |
| `DATABASE_URL` | Neon `postgresql://…` |
| `JWT_SECRET` | Strong random 32+ chars |
| `STRIPE_SECRET_KEY` | Live secret |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook |
| `STRIPE_PRICE_STARTER` … `STRIPE_PRICE_AGENCY` | Five `price_…` IDs |

Optional: `GOOGLE_SITE_VERIFICATION`, OAuth vars for social connect, etc.

Redeploy after saving.

### 4. Domain

- [ ] Custom domain **creatorflow365.com** (and **www**) attached to the **correct** Vercel project  
- [ ] SSL active  
- [ ] `NEXT_PUBLIC_APP_URL` matches the URL users actually open

### 5. Smoke tests

- [ ] Sign up → trial / checkout → webhook fired → user row updated  
- [ ] Cancel checkout returns to a sane URL (`/signup?canceled=true` on trial flow)  
- [ ] Credits/add-ons if you sell them

---

## Docs that match this repo

- `ENVIRONMENT_VARIABLES.md` — env cheat sheet  
- `CURRENT_PLAN_PRICES.md` — amounts aligned with `PlanSelection.tsx`  
- `LAUNCH_STATUS_CHECK.md` — checkbox version  
- `CREATORFLOW365_PRODUCTION.md` — production URL notes  

---

## Next step (human)

Complete **Stripe Live + Neon + Vercel Production env**, redeploy, then run the **smoke tests** above. Say what failed if anything breaks—we fix code next.
