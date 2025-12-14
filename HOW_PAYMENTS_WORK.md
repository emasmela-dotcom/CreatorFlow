# How Payment Platforms Work - Simple Explanation

## 🎯 Quick Answer

**You need to:**
1. ✅ **Set up prices per plan** in Stripe Dashboard (one-time setup)
2. ✅ **Connect your bank account** to Stripe (one-time setup)
3. ✅ **Choose payout schedule**: Automatic (default) or Manual (funds stay in Stripe until you withdraw)

---

## 💰 How Money Flows

### Step-by-Step Process:

1. **Customer pays $29/month for Pro Plan**
   - Customer enters credit card on your site
   - Stripe processes the payment

2. **Stripe takes their fee**
   - Stripe fee: $0.84 (2.9% + $0.30)
   - Your revenue: $28.16

3. **Money goes to your Stripe balance OR bank account**
   - **Automatic payouts (default)**: Stripe automatically transfers $28.16 to your bank (2-7 days)
   - **Manual payouts**: $28.16 stays in your Stripe balance until you manually withdraw
   - You can change this in Stripe Settings → Bank accounts and scheduling

4. **You receive the money**
   - Check your bank account
   - Money is yours to use

---

## 📋 What You Need to Set Up

### 1. Create Products/Prices in Stripe (One-Time Setup)

**You DO need to create each plan price in Stripe Dashboard:**

1. Go to https://dashboard.stripe.com/
2. Click **"Products"** → **"+ Add product"**
3. For each plan, create:
   - **Starter Plan**: $5/month
   - **Growth Plan**: $19/month
   - **Pro Plan**: $29/month
   - **Business Plan**: $39/month
   - **Agency Plan**: $89/month

4. **Copy the Price ID** (looks like `price_1AbCdEfGhIjKlMn...`)
5. **Add to your environment variables** (Vercel)

**Why?** Stripe needs to know:
- How much to charge
- When to charge (monthly)
- What product the customer is buying

---

### 2. Connect Your Bank Account (One-Time Setup)

**You need to connect a bank account to receive money:**

1. Go to Stripe Dashboard → **Settings** → **Bank accounts and scheduling**
2. Click **"Add bank account"**
3. Enter your:
   - Bank account number
   - Routing number
   - Account holder name
4. Verify your account (Stripe will make 2 small deposits to verify)

**Why?** Stripe needs somewhere to send your money!

---

### 3. Set Up Payout Schedule (Optional)

**Stripe automatically sends money to your bank:**

- **Default**: Every 2-7 business days
- **You can change**: Daily, weekly, or monthly payouts
- **Location**: Stripe Dashboard → Settings → Payouts

---

## 🔄 How It Works in Practice

### Example: Customer Subscribes to Pro Plan ($29/month)

**Day 1: Customer Subscribes**
- Customer enters card info
- Stripe charges $29
- Stripe takes $0.84 fee (2.9% + $0.30)
- **$28.16 is queued** for transfer to your bank

**Day 2-7: Money Transfers**
- Stripe automatically transfers $28.16 to your bank account
- You receive notification email from Stripe
- Money appears in your bank account

**Every Month:**
- Stripe automatically charges customer $29
- Stripe takes $0.84 fee
- $28.16 transfers to your bank
- **No action needed from you!**

---

## 📊 Where to See Your Money

### Stripe Dashboard:
- **Balance**: Shows money waiting to transfer
- **Payouts**: Shows money being transferred
- **Transactions**: Shows all payments

### Your Bank Account:
- **Actual money** you can use
- Usually arrives 2-7 business days after payment

---

## ⚙️ What Your Code Does

Your code (already set up):
1. ✅ Creates Stripe checkout session
2. ✅ Uses Price IDs you configure
3. ✅ Handles webhooks (subscription updates)
4. ✅ Updates user's plan in database

**You just need to:**
1. Create products/prices in Stripe Dashboard
2. Add Price IDs to environment variables
3. Connect your bank account

---

## 🎯 Summary

**Do you need to set up prices?**
- ✅ **YES** - Create products/prices in Stripe Dashboard (one-time, 10 minutes)

**Does it store funds?**
- ✅ **YES (if you choose manual payouts)** - Funds stay in Stripe balance until you withdraw
- ✅ **NO (if automatic payouts)** - Funds automatically transfer to your bank account
- You can choose either option in Stripe Settings

**What do you need to do?**
1. Create 5 products in Stripe (one-time)
2. Connect your bank account (one-time)
3. Choose payout schedule: Automatic or Manual (one-time)
4. Add Price IDs to Vercel environment variables (one-time)
5. **That's it!** Money flows automatically after that

**For Manual Payouts:**
- Set payout schedule to "Manual" in Stripe Settings → Bank accounts and scheduling
- Funds stay in Stripe balance until you manually withdraw
- Withdraw anytime from Stripe Dashboard → Balance → Pay out funds

---

## 🚀 Next Steps

1. **Create Stripe account** (if you don't have one)
2. **Create 5 products** in Stripe Dashboard
3. **Connect bank account** to Stripe
4. **Copy Price IDs** and add to Vercel
5. **Test with Stripe test cards**

**Want me to walk you through creating the products step-by-step?**

