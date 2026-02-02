# Credit Bundles – Purchase Flow

Credit bundles are purchasable on the site. This doc summarizes how it works.

---

## Bundles (agreed site pricing)

| Bundle   | Price | Credits | Notes                    |
|----------|-------|---------|--------------------------|
| Starter  | $5    | 50      | $0.10/credit             |
| Popular  | $10   | 100     | $0.10/credit, Most Popular |
| Power    | $20   | 250     | $0.08/credit, Save $5 (20% off) |

---

## Flow

1. **Homepage** – Credit Bundles section: user clicks “Buy credits” for a bundle.
2. **Auth** – If not logged in, redirect to `/signin?redirect=/#credits`. If logged in, continue.
3. **Checkout** – `POST /api/user/purchase-credits` with `{ bundle: 'starter' | 'popular' | 'power' }` creates a Stripe Checkout session (one-time payment). User is redirected to Stripe.
4. **Success** – After payment, Stripe sends `checkout.session.completed` to the webhook. Webhook sees `metadata.type === 'credit_bundle'` and adds `metadata.credits` to `users.credits_balance`.
5. **Redirect** – User lands on `/dashboard?credits=success&credits=50` (or 100 / 250).

---

## Backend

- **DB:** `users.credits_balance` (integer, default 0). Added in migrations; ensure DB has run migrations so the column exists.
- **API:** `GET /api/user/purchase-credits` – returns `creditsBalance` and `bundles`.  
  `POST /api/user/purchase-credits` – body `{ bundle }`, returns `{ url }` for Stripe Checkout.
- **Webhook:** `src/app/api/stripe/webhook/route.ts` handles `checkout.session.completed` for `mode === 'payment'` and `metadata.type === 'credit_bundle'`, and adds credits to `users.credits_balance`.

---

## Stripe

No extra env vars. Uses existing `STRIPE_SECRET_KEY`. One-time payments are created with `price_data` (no separate Price IDs needed). Ensure the Stripe webhook endpoint is set for `checkout.session.completed` so one-time payments are confirmed.
