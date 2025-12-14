# CreatorFlow - Current Plan Prices

**Last Updated:** December 8, 2025

---

## 💰 Current Pricing Structure

| Plan | Monthly Price | Annual Equivalent | Stripe Price ID Variable |
|------|---------------|-------------------|-------------------------|
| **Free** | $0 | $0 | N/A (no Stripe product needed) |
| **Starter** | $5 | $60 | `STRIPE_PRICE_STARTER` |
| **Growth** | $19 | $228 | `STRIPE_PRICE_GROWTH` |
| **Pro** | $29 | $348 | `STRIPE_PRICE_PRO` |
| **Business** | $39 | $468 | `STRIPE_PRICE_BUSINESS` |
| **Agency** | $89 | $1,068 | `STRIPE_PRICE_AGENCY` |

---

## 📋 Where Prices Are Defined

### 1. **Frontend Display** (`src/components/PlanSelection.tsx`)
```typescript
const plans: Plan[] = [
  { id: 'free', name: 'Free', price: 0 },
  { id: 'starter', name: 'Starter', price: 5 },
  { id: 'growth', name: 'Growth', price: 19 },
  { id: 'pro', name: 'Pro', price: 29 },
  { id: 'business', name: 'Business', price: 39 },
  { id: 'agency', name: 'Agency', price: 89 }
]
```

### 2. **Stripe Products** (Stripe Dashboard)
- You need to create 5 products in Stripe Dashboard
- Each product should match the prices above
- Price IDs are stored in environment variables

### 3. **Documentation**
- `STRIPE_PAYMENT_SETUP_COMPLETE.md` - Setup guide
- `ALL_CREATORFLOW_PLANS.md` - Complete plan details
- `PLAN_UPGRADE_COMPARISON.md` - Upgrade comparisons

---

## 🔧 If You Need to Change Prices

### Step 1: Update Frontend Code
**File:** `src/components/PlanSelection.tsx`
- Update the `price` values in the `plans` array
- Example: Change `price: 5` to `price: 9` for Starter

### Step 2: Update Stripe Products
1. Go to Stripe Dashboard → Products
2. Edit each product's price
3. **OR** create new prices for existing products
4. Copy the new Price IDs

### Step 3: Update Environment Variables
**In Vercel:**
- Go to Settings → Environment Variables
- Update the `STRIPE_PRICE_*` variables with new Price IDs
- Redeploy the project

**In `.env.local` (for local development):**
- Update the `STRIPE_PRICE_*` variables

### Step 4: Update Documentation
- Update `STRIPE_PAYMENT_SETUP_COMPLETE.md`
- Update `ALL_CREATORFLOW_PLANS.md`
- Update `PLAN_UPGRADE_COMPARISON.md`

---

## 📊 Current Price Breakdown

### Free Plan
- **Price:** $0/month
- **Stripe:** Not needed (no payment)

### Starter Plan
- **Price:** $5/month
- **Stripe Product:** "Starter Plan"
- **Stripe Price:** $5.00 USD, Recurring Monthly
- **Environment Variable:** `STRIPE_PRICE_STARTER`

### Growth Plan
- **Price:** $19/month
- **Stripe Product:** "Growth Plan"
- **Stripe Price:** $19.00 USD, Recurring Monthly
- **Environment Variable:** `STRIPE_PRICE_GROWTH`

### Pro Plan
- **Price:** $29/month
- **Stripe Product:** "Pro Plan"
- **Stripe Price:** $29.00 USD, Recurring Monthly
- **Environment Variable:** `STRIPE_PRICE_PRO`

### Business Plan
- **Price:** $39/month
- **Stripe Product:** "Business Plan"
- **Stripe Price:** $39.00 USD, Recurring Monthly
- **Environment Variable:** `STRIPE_PRICE_BUSINESS`

### Agency Plan
- **Price:** $89/month
- **Stripe Product:** "Agency Plan"
- **Stripe Price:** $89.00 USD, Recurring Monthly
- **Environment Variable:** `STRIPE_PRICE_AGENCY`

---

## ⚠️ Important Notes

### If You Change Prices:
1. **Existing Subscriptions:** Stripe will continue charging old prices for existing customers
2. **New Subscriptions:** Will use new prices
3. **Price Updates:** You can update existing subscriptions in Stripe Dashboard if needed

### Stripe Best Practices:
- **Don't delete old prices** - Archive them instead
- **Create new prices** for price changes
- **Update Price IDs** in environment variables
- **Test with Stripe test mode** before going live

---

## 🎯 Quick Reference

**Current Prices:**
- Free: $0
- Starter: $5
- Growth: $19
- Pro: $29
- Business: $39
- Agency: $89

**Total Monthly Revenue (if all plans sold):**
- $181/month (excluding Free)

**Files to Update if Prices Change:**
1. `src/components/PlanSelection.tsx` (frontend display)
2. Stripe Dashboard (products/prices)
3. Vercel Environment Variables (Price IDs)
4. Documentation files

---

**Need to change prices?** Let me know what the new prices should be and I can help update everything!

