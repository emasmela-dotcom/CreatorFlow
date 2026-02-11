# CreatorFlow – Setup List (with descriptions)

One list of what to do, with a short description for each item.

---

## Stripe – Subscription plans (create in Stripe)

Your Product catalog was empty. Create **5 products** (one per plan) so the site can charge for subscriptions.

| # | Product name   | Price | Description |
|---|----------------|-------|-------------|
| 1 | **Starter**   | $9/month  | Entry plan. Create product in Stripe, add one recurring price $9/month. Copy the **Price ID** (starts with `price_`). |
| 2 | **Essential**  | $19/month | Growth plan. Create product, add price $19/month. Copy Price ID. |
| 3 | **Creator**   | $49/month | Creator plan. Create product, add price $49/month. Copy Price ID. |
| 4 | **Professional** | $79/month | Pro plan. Create product, add price $79/month. Copy Price ID. |
| 5 | **Business**  | $149/month | Business plan. Create product, add price $149/month. Copy Price ID. |

**How:** Stripe Dashboard → Product catalog → **+ Add product**. Name = plan name, add one price (recurring, monthly, amount above). After saving, open the price and copy the **Price ID**.

---

## Vercel – Environment variables (map Stripe to site)

Put each Price ID in the right env var so the site uses the correct plan.

| Env var | Description | Value |
|---------|-------------|--------|
| **STRIPE_PRICE_STARTER** | Price ID for Starter $9 plan. | Paste the `price_...` for your $9 product. |
| **STRIPE_PRICE_GROWTH** | Price ID for Essential $19 plan. | Paste the `price_...` for your $19 product. |
| **STRIPE_PRICE_PRO** | Price ID for Creator $49 plan. | Paste the `price_...` for your $49 product. |
| **STRIPE_PRICE_BUSINESS** | Price ID for Professional $79 plan. | Paste the `price_...` for your $79 product. |
| **STRIPE_PRICE_AGENCY** | Price ID for Business $149 plan. | Paste the `price_...` for your $149 product. |
| **STRIPE_SECRET_KEY** | Stripe secret key (live or test). Needed so the site can create checkouts. | Set for **Production** if you want live payments on www.creatorflow365.com. |
| **STRIPE_WEBHOOK_SECRET** | Webhook signing secret from Stripe. Used to verify that events really come from Stripe. | Already set (All Environments). |
| **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** | Stripe publishable key. Used by the front end for Stripe.js/checkout. | Set for **Production** if you want live payments. |
| **JWT_SECRET** | Secret for signing login tokens. | Already set (All Environments). |
| **DATABASE_URL** | Neon PostgreSQL connection string. | Already set (Production). |

---

## Credit bundles ($5 / $10 / $20)

**Description:** Credit bundles do **not** use Stripe products or price IDs. The app sends the amount and name at checkout (`price_data`). No products to create in Stripe for $5, $10, or $20. Just ensure **STRIPE_SECRET_KEY** and the **webhook** are set for the environment you use; the webhook adds credits when `metadata.type === 'credit_bundle'`.

---

## Completion list (site functional)

| # | Item | Description |
|---|------|-------------|
| 1 | **Deploy** | Code on `main`, Vercel build Ready. **Done.** |
| 2 | **Stripe webhook** | Endpoint `https://www.creatorflow365.com/api/stripe/webhook`, events configured, signing secret in Vercel. **Done.** |
| 3 | **Stripe prices** | Create 5 products in Stripe ($9, $19, $49, $79, $149), copy Price IDs into Vercel env vars above. Confirm Stripe keys set for Production for live payments. |
| 4 | **Smoke test** | Sign up → pick a plan → checkout or trial. Then Dashboard → buy a credit bundle ($5/$10/$20) → confirm credits update (or webhook in Stripe). |
| 5 | **Quick QA** | Log out and log in. One full plan checkout and one credit purchase with no errors. |

**Done when:** 3, 4, and 5 are complete. Then site is functional for v1; market and add features (e.g. direct posting) later.
