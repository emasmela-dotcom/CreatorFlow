# 🎯 Stripe Setup - Detailed Step-by-Step Guide

## PART 1: Switch to Live Mode

1. **Open browser** → Go to: https://dashboard.stripe.com/
2. **Log in** to your Stripe account
3. **Look at the top-right corner** → You'll see a toggle that says "Test mode" or "Live mode"
4. **Click the toggle** to switch to **Live mode** (it will turn from gray/blue to indicate Live mode is active)
5. **You should now see "Live mode"** in the top right

---

## PART 2: Create Your First Product (Starter Plan)

### Step-by-Step:

1. **In Stripe Dashboard** → Look at the left sidebar
2. **Find and click** on **"Products"** (it's usually in the main menu)
3. **You'll see a page with a button** that says **"+ Add product"** or **"Add product"** → **Click it**
4. **Fill in the form:**
   - **Name**: Type `Starter Plan`
   - **Description** (optional): You can leave blank or add "Perfect for individual creators"
   - **Scroll down** to find the **"Pricing"** section
   - **Price**: Type `19`
   - **Currency**: Should already say "USD" (US Dollar)
   - **Billing**: Look for "Recurring" option → **Select it**
   - **Billing period**: Choose **"Monthly"** from dropdown
5. **Click "Save product"** or **"Add product"** button (usually bottom right)
6. **After saving**, you'll see the product page
7. **Look for "Price ID"** - it looks like `price_1AbCdEfGhIjKlMn...`
8. **Click the copy icon** (📋) next to the Price ID, or **select it and copy** (Cmd+C on Mac, Ctrl+C on Windows)
9. **Go back to `STRIPE_SETUP_VALUES.md`**
10. **Find the line**: `STRIPE_PRICE_STARTER = price____________________`
11. **Replace the underscores** with your copied Price ID
12. **Save the file**

---

## PART 3: Create Remaining 4 Products

**Repeat the same process for each:**

### Growth Plan:
1. Click **"+ Add product"** again
2. Name: `Growth Plan`
3. Price: `29`
4. Billing: Recurring → Monthly
5. Save and copy Price ID
6. Paste in `STRIPE_SETUP_VALUES.md` next to `STRIPE_PRICE_GROWTH`

### Pro Plan:
1. Click **"+ Add product"** again
2. Name: `Pro Plan`
3. Price: `39`
4. Billing: Recurring → Monthly
5. Save and copy Price ID
6. Paste in `STRIPE_SETUP_VALUES.md` next to `STRIPE_PRICE_PRO`

### Business Plan:
1. Click **"+ Add product"** again
2. Name: `Business Plan`
3. Price: `49`
4. Billing: Recurring → Monthly
5. Save and copy Price ID
6. Paste in `STRIPE_SETUP_VALUES.md` next to `STRIPE_PRICE_BUSINESS`

### Agency Plan:
1. Click **"+ Add product"** again
2. Name: `Agency Plan`
3. Price: `99`
4. Billing: Recurring → Monthly
5. Save and copy Price ID
6. Paste in `STRIPE_SETUP_VALUES.md` next to `STRIPE_PRICE_AGENCY`

---

## PART 4: Get Your API Secret Key

1. **In Stripe Dashboard** → Look at the left sidebar
2. **Find "Developers"** → **Click it** (it might have a dropdown arrow)
3. **Click "API keys"** from the dropdown (or it might be directly under Developers)
4. **You'll see two keys:**
   - **Publishable key** (starts with `pk_live_`) - DON'T COPY THIS
   - **Secret key** (starts with `sk_live_`) - **THIS IS THE ONE YOU NEED**
5. **Next to "Secret key"**, click **"Reveal test key"** or **"Reveal"** button to show it
6. **Click the copy icon** (📋) next to the Secret key
7. **Go to `STRIPE_SETUP_VALUES.md`**
8. **Find**: `STRIPE_SECRET_KEY = sk_live____________________`
9. **Replace underscores** with your copied secret key
10. **Save the file**

---

## PART 5: Set Up Webhook

1. **Still in Stripe Dashboard** → **Developers** (left sidebar)
2. **Click "Webhooks"** (should be right under "API keys")
3. **Click "+ Add endpoint"** button (usually top right)
4. **Fill in:**
   - **Endpoint URL**: Type exactly: `https://creatorflow.ai/api/stripe/webhook`
   - **Description** (optional): `CreatorFlow Production Webhook`
5. **Click "Select events"** button
6. **You'll see a list of events** - Find and **check these 4 boxes:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `invoice.payment_failed`
7. **Click "Add endpoint"** or **"Add events"** button
8. **After creating**, you'll see the webhook details page
9. **Look for "Signing secret"** → It starts with `whsec_`
10. **Click "Reveal"** or **"Click to reveal"** to show it
11. **Click the copy icon** (📋) next to the signing secret
12. **Go to `STRIPE_SETUP_VALUES.md`**
13. **Find**: `STRIPE_WEBHOOK_SECRET = whsec____________________`
14. **Replace underscores** with your copied webhook secret
15. **Save the file**

---

## ✅ Checklist - Make Sure You Have:

Before moving to Step 2, verify:

- [ ] All 5 products created
- [ ] All 5 Price IDs copied to `STRIPE_SETUP_VALUES.md`
- [ ] Secret key copied (starts with `sk_live_`)
- [ ] Webhook endpoint created
- [ ] Webhook secret copied (starts with `whsec_`)
- [ ] All values saved in `STRIPE_SETUP_VALUES.md`

---

## 🆘 Troubleshooting

**Can't find "Products"?**
- It's in the left sidebar menu, might need to scroll
- On mobile, look for a hamburger menu (☰)

**Can't find "Developers"?**
- It's also in the left sidebar
- Might be near the bottom of the menu

**Price ID doesn't show?**
- Make sure you saved the product first
- Click on the product name to see its details page
- Price ID is usually at the top of the product page

**Webhook secret hidden?**
- Look for "Reveal" or "Click to reveal" button
- Click it to show the secret
- Copy it immediately (it might hide again)

---

**Once you complete all parts above, tell me and we'll move to Step 2 (Database Setup)! 🚀**

