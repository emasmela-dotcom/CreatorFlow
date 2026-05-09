# Quick Launch Guide — CreatorFlow365

Canonical URLs and env details: **`PRE_LAUNCH_STATUS.md`**, **`ENVIRONMENT_VARIABLES.md`**.

## Step 1: Stripe (Live)

1. **Stripe Dashboard** → https://dashboard.stripe.com/ → **Live mode**
2. **Five subscription prices** (match app / **`CURRENT_PLAN_PRICES.md`** — internal ids: `starter`, `growth`, `pro`, `business`, `agency`):
   - Starter — **$9**/mo  
   - Essential (growth) — **$19**/mo  
   - Creator (pro) — **$49**/mo  
   - Professional (business) — **$79**/mo  
   - Agency — **$149**/mo  
3. Copy each **Price ID** (`price_…`) into Vercel as `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`, etc.
4. **Webhooks** → Add endpoint: **`https://www.creatorflow365.com/api/stripe/webhook`**  
   Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `invoice.payment_failed`  
5. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

## Step 2: Database (Neon)

1. **Neon** → create production database → copy connection string  
2. Set **`DATABASE_URL`** (or **`NEON_DATABASE_URL`**) in Vercel Production

## Step 3: Vercel environment variables

Production examples (see **`ENVIRONMENT_VARIABLES.md`** for full list):

```env
NEXT_PUBLIC_APP_URL=https://www.creatorflow365.com
NEXT_PUBLIC_BASE_URL=https://www.creatorflow365.com

DATABASE_URL=postgresql://...

JWT_SECRET=<strong-random-secret>

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_BUSINESS=price_...
STRIPE_PRICE_AGENCY=price_...
```

Optional: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `GOOGLE_SITE_VERIFICATION`

Redeploy after saves.

## Step 4: DNS

Point **creatorflow365.com** (and **www**) at Vercel per Vercel → Settings → Domains. Wait for DNS + SSL.

## Step 5: Final testing

1. Open **https://www.creatorflow365.com** — signup → paid plan → Stripe Checkout → return to app  
2. **Stripe** → Events / Webhooks — deliveries OK  
3. **Neon** — user / subscription fields updated as expected  

---

## Troubleshooting

| Issue | Checks |
|-------|--------|
| Webhook failures | URL exactly `https://www.creatorflow365.com/api/stripe/webhook`; Live mode secret; redeploy |
| DB errors | `DATABASE_URL` / migrations; Neon project active |
| Wrong redirect URLs | `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_BASE_URL` |

---

## Post-launch (optional)

- Error monitoring, alerts  
- Meta campaigns + **`NEXT_PUBLIC_META_PIXEL_ID`** if using Meta Pixel  

See **`FINAL_LAUNCH_CHECKLIST.md`** for a short checklist.
