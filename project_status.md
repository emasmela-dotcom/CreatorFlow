# CreatorFlow – Project Status

**Last Updated:** February 4, 2026  
**Production:** https://www.creatorflow365.com

---

## Current status

### Deployment (Vercel)

| Item | Status |
|------|--------|
| **Vercel project** | creatorflow365 |
| **Repo** | CreatorFlow (main) |
| **Domain** | www.creatorflow365.com |
| **Build** | Ready (ESLint ignored during build; JWT_SECRET not required at build time) |
| **JWT_SECRET** | Set in Vercel env (Production) |
| **Deploy** | `git push origin main` → auto-deploy |

### Stripe

| Item | Status |
|------|--------|
| **Webhook (production)** | Endpoint: `https://www.creatorflow365.com/api/stripe/webhook` |
| **Events** | checkout.session.completed, customer.subscription.created/updated, invoice.payment_failed |
| **STRIPE_WEBHOOK_SECRET** | Set in Vercel (production) |
| **STRIPE_SECRET_KEY** | Set in Vercel |
| **Price IDs** | STRIPE_PRICE_STARTER, _GROWTH, _PRO, _BUSINESS, _AGENCY in Vercel |
| **Test mode** | Toggle in Stripe Dashboard (top-right or account menu); use test keys in Vercel for no-real-money testing |

### Pricing & plans

| Item | Status |
|------|--------|
| **Free plan** | Removed from UI and signup; only paid plans offered |
| **Plans shown** | Starter $9, Essential $19, Creator $49, Professional $79, Business $149 |
| **Credit bundles** | Homepage: $5 (50), $10 (100), $20 (250); API + webhook handle purchases |
| **Trial** | 14-day free trial for paid plans (no free tier) |

### Database (Neon)

| Item | Status |
|------|--------|
| **DATABASE_URL** | Set in Vercel |
| **users** | subscription_tier, credits_balance, trial_plan, etc. |
| **Migrations** | See DB_SETUP_HOW.md, sql/ |

---

## Launch checklist (condensed)

| Step | Done |
|------|------|
| Deploy latest code (Vercel Ready) | ✅ |
| JWT_SECRET in Vercel | ✅ |
| Stripe webhook endpoint + signing secret in Vercel | ✅ |
| Free plan removed; paid plans only | ✅ |
| Stripe prices in Stripe + price IDs in Vercel | Confirm |
| Smoke test (sign up → plan → checkout; buy credits) | Optional |

Optional: Privacy/Terms pages, 404 check, support@ (ImprovMX).  
See **LAUNCH_CHECKLIST_FINAL.md** and **STRIPE_WEBHOOK_AND_SMOKE_TEST.md** for details.

---

## Tech stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT
- **Payments:** Stripe
- **Deploy:** Vercel
- **UI:** React, Tailwind CSS

---

## Quick reference

- **Deploy:** Push to `main` → Vercel deploys.
- **Stripe webhook:** Workbench → Webhooks → Add destination (or direct `/webhooks`); get signing secret → Vercel `STRIPE_WEBHOOK_SECRET` → Redeploy.
- **Test mode:** Stripe Dashboard toggle; use test keys + test webhook secret in Vercel for test cards (e.g. 4242 4242 4242 4242).
- **Docs:** LAUNCH_CHECKLIST_FINAL.md, STRIPE_WEBHOOK_AND_SMOKE_TEST.md, VERCEL_STRIPE_ENV_VARS.md, DB_SETUP_HOW.md.

---

**Status:** Production live at www.creatorflow365.com. Signup → dashboard (plan optional); dashboard nav in 2 rows; Sign Out in sidebar; auth/signin and forgot-password fixes in place. Smoke test and Stripe price alignment recommended before marketing.
