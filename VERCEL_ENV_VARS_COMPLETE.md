# Vercel Environment Variables - Complete List

**Copy these EXACTLY into Vercel Dashboard → Settings → Environment Variables**

**IMPORTANT:** Set environment to **"Production"** for all variables

---

## 1. Application URL
```
NEXT_PUBLIC_APP_URL=https://creatorflow.ai
```

---

## 2. Database (Neon PostgreSQL)
```
DATABASE_URL=postgresql://neondb_owner:npg_VlAkJ4ij9nRI@ep-crimson-dew-a4x50rh1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## 3. Authentication (JWT Secret)
```
JWT_SECRET=ea9c536788ae3146029ebf6dd01d926cc4419b77fca1fe66809f7a555ab5a5c0
```

---

## 4. Stripe (Live Mode)

### Stripe Secret Key
```
STRIPE_SECRET_KEY=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
```

### Stripe Webhook Secret
```
STRIPE_WEBHOOK_SECRET=whsec_J0hMDb0ahvxo4qyt62zEQyvCZJdKiG2K
```

### Stripe Price IDs (5 Plans)

**Starter Plan ($19/month)**
```
STRIPE_PRICE_STARTER=price_1SOqFjIGaH1td4JMBwcypWwV
```

**Growth Plan ($29/month)**
```
STRIPE_PRICE_GROWTH=price_1SOqUCIGaH1td4JMMG0dRT1V
```

**Pro Plan ($39/month)**
```
STRIPE_PRICE_PRO=price_1SOqdilGaH1td4JMxVVWSaBR
```

**Business Plan ($49/month)**
```
STRIPE_PRICE_BUSINESS=price_1SOqgTIGaH1td4JMUMgZxq89
```

**Agency Plan ($99/month)**
```
STRIPE_PRICE_AGENCY=price_1SOqiklGaH1td4JMON17yzmP
```

---

## Quick Add Instructions

1. Go to: https://vercel.com/dashboard
2. Select your **CreatorFlow** project
3. Click **Settings** → **Environment Variables**
4. For EACH variable above:
   - Click **"Add New"**
   - Paste the **Variable Name** (left side)
   - Paste the **Value** (right side)
   - Select **"Production"** environment
   - Click **"Save"**
5. After adding all 11 variables, **redeploy** your project

---

## Total Variables Needed: 11

1. `NEXT_PUBLIC_APP_URL`
2. `DATABASE_URL`
3. `JWT_SECRET` (generate first)
4. `STRIPE_SECRET_KEY`
5. `STRIPE_WEBHOOK_SECRET`
6. `STRIPE_PRICE_STARTER`
7. `STRIPE_PRICE_GROWTH`
8. `STRIPE_PRICE_PRO`
9. `STRIPE_PRICE_BUSINESS`
10. `STRIPE_PRICE_AGENCY`

---

**Next:** After adding all variables, redeploy and test!

