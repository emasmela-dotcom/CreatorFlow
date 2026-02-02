# Add Stripe env vars to Vercel

Do this in **Vercel** (browser). Your values are in `STRIPE_SETUP_VALUES.md` — use them below.

**Agreed site prices:** Starter $9, Essential $19, Creator $49, Professional $79, Business $149. In Stripe, create or update products to these amounts and use those price IDs for `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_BUSINESS`, `STRIPE_PRICE_AGENCY` so checkout matches the site.

---

## 1. Open Vercel Environment Variables

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Click your **CreatorFlow** project (or the project for creatorflow365.com)
3. Click **Settings** (top)
4. In the left sidebar, click **Environment Variables**

---

## 2. Add these 7 variables

Click **Add New** for each. Use **Production** (and **Preview** if you want). Paste the **Value** from the right column.

| Name | Value (copy from here or from STRIPE_SETUP_VALUES.md) |
|------|------------------------------------------------------|
| `STRIPE_SECRET_KEY` | `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` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_J0hMDb0ahvxo4qyt62zEQyvCZJdKiG2K` |
| `STRIPE_PRICE_STARTER` | `price_1SOqFjIGaH1td4JMBwcypWwV` |
| `STRIPE_PRICE_GROWTH` | `price_1SOqUCIGaH1td4JMMG0dRT1V` |
| `STRIPE_PRICE_PRO` | `price_1SOqdilGaH1td4JMxVVWSaBR` |
| `STRIPE_PRICE_BUSINESS` | `price_1SOqgTIGaH1td4JMUMgZxq89` |
| `STRIPE_PRICE_AGENCY` | `price_1SOqiklGaH1td4JMON17yzmP` |

**Note:** If you created a **new** webhook in Stripe for creatorflow365.com, use that webhook’s **Signing secret** for `STRIPE_WEBHOOK_SECRET` instead of the value above.

---

## 3. Save and redeploy

1. After adding all 7, confirm they’re listed under **Environment Variables**.
2. Go to **Deployments**.
3. Open the **⋯** menu on the latest deployment → **Redeploy** (or push a new commit to trigger a deploy).

New deployments will have the Stripe env vars; checkout and webhooks will work once the webhook URL in Stripe points to your live domain (see `STRIPE_WEBHOOK_SETUP.md`).

---

## Checklist

| Step | Done |
|------|------|
| Vercel → Project → Settings → Environment Variables | ☐ |
| Add `STRIPE_SECRET_KEY` | ☐ |
| Add `STRIPE_WEBHOOK_SECRET` | ☐ |
| Add `STRIPE_PRICE_STARTER` | ☐ |
| Add `STRIPE_PRICE_GROWTH` | ☐ |
| Add `STRIPE_PRICE_PRO` | ☐ |
| Add `STRIPE_PRICE_BUSINESS` | ☐ |
| Add `STRIPE_PRICE_AGENCY` | ☐ |
| Redeploy project | ☐ |
