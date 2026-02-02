# Stripe Webhook + Smoke Test – Do It Now

Follow these in order. Your site is already deployed and Ready.

---

## Part 1: Stripe webhook (production)

1. **Open Stripe**
   - Go to https://dashboard.stripe.com and sign in.
   - Make sure you’re in **Live** mode (toggle top-right) if you want production. For testing first, **Test** mode is fine.

2. **Add webhook endpoint**
   - Left sidebar: **Developers** → **Webhooks**.
   - Click **Add endpoint**.
   - **Endpoint URL:**  
     `https://www.creatorflow365.com/api/stripe/webhook`
   - **Events to send:** Click “Select events” and add:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `invoice.payment_failed`
   - Click **Add endpoint**.

3. **Get the signing secret**
   - On the new webhook’s page, open **Signing secret** (e.g. “Reveal” or “Click to reveal”).
   - Copy the value (starts with `whsec_`).

4. **Put it in Vercel**
   - Vercel → your project **creatorflow365** → **Settings** → **Environment Variables**.
   - If **STRIPE_WEBHOOK_SECRET** already exists: **Edit** and paste the new secret (so it’s the *production* webhook secret).
   - If it doesn’t exist: **Add** → Key: `STRIPE_WEBHOOK_SECRET`, Value: paste the secret → **Production** (and Preview if you use it) → **Save**.

5. **Redeploy once**
   - **Deployments** → latest deployment → **⋯** → **Redeploy** so the new secret is used.

---

## Part 2: Smoke test

Do this on the live site (e.g. https://www.creatorflow365.com).

1. **Sign up**
   - Go to the homepage → **Start Free Trial** or **Sign Up**.
   - Enter email + password and complete signup.

2. **Plan / trial**
   - You should land on plan selection or dashboard.
   - Pick a plan (e.g. Creator) → **Start free trial** or **Subscribe now**.
   - If it goes to Stripe Checkout, you can complete with a test card (Test mode: `4242 4242 4242 4242`) or cancel to confirm the flow works.

3. **Credit bundles (logged in)**
   - From the homepage or dashboard, find **Credit Bundles**.
   - Click **Buy credits** on one bundle ($5 / $10 / $20).
   - Complete or cancel checkout; confirm no errors.

4. **Quick checks**
   - Log out and log back in.
   - Open dashboard; confirm no broken pages.

If anything fails, check:
- **Stripe Dashboard** → **Developers** → **Webhooks** → your endpoint → **Recent deliveries** (success/failure).
- **Vercel** → **Deployments** → your deployment → **Logs** (runtime errors).

---

## Optional: Stripe prices

If plan prices on the site don’t match Stripe (e.g. Starter $9, Essential $19, Creator $49, Professional $79, Business $149), create or update products/prices in Stripe and set the price IDs in Vercel env vars: `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_BUSINESS`, `STRIPE_PRICE_AGENCY`. See `VERCEL_STRIPE_ENV_VARS.md`.
