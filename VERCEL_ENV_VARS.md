# 🚀 Vercel Environment Variables - Ready to Add

**Copy and paste these into Vercel Dashboard → Settings → Environment Variables**

**⚠️ IMPORTANT:** Select "Production" environment for all variables

---

## All Environment Variables (Copy Each One)

### 1. Application URL
```
NEXT_PUBLIC_APP_URL
```
**Value:**
```
https://creatorflow.ai
```

---

### 2. Database (Turso)
```
TURSO_DATABASE_URL
```
**Value:**
```
libsql://creatorflow-production-emasmela.aws-us-east-2.turso.io
```

```
TURSO_AUTH_TOKEN
```
**Value:**
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjIwODIxMjgsImlkIjoiZmFhYzY5MDYtNjQ1Mi00NWYzLWJlNmMtZGViNmY3YzE2NDZmIiwicmlkIjoiNmI3YzYwMWItZTk5MS00ODgyLTllZDgtNDcyNTY1NWIzYWEwIn0.LNdCA15e8ENeBO71s_O2NO9ISaX0WMzlax81zJqijpqcqBdgQLq4wpl4bmsAHVE4TZF9gLyRZl2H65v_gixuDw
```

---

### 3. Authentication (JWT Secret)
```
JWT_SECRET
```
**Value:**
```
9ab38186267c531d3e89bb9d7ba0b874529289719f47e1282072759c2b7c3d73
```

---

### 4. Stripe - API Keys
```
STRIPE_SECRET_KEY
```
**Value:**
```
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
```

```
STRIPE_WEBHOOK_SECRET
```
**Value:**
```
whsec_J0hMDb0ahvxo4qyt62zEQyvCZJdKiG2K
```

---

### 5. Stripe - Price IDs (5 Plans)
```
STRIPE_PRICE_STARTER
```
**Value:**
```
price_1SOqFjIGaH1td4JMBwcypWwV
```

```
STRIPE_PRICE_GROWTH
```
**Value:**
```
price_1SOqUCIGaH1td4JMMG0dRT1V
```

```
STRIPE_PRICE_PRO
```
**Value:**
```
price_1SOqdilGaH1td4JMxVVWSaBR
```

```
STRIPE_PRICE_BUSINESS
```
**Value:**
```
price_1SOqgTIGaH1td4JMUMgZxq89
```

```
STRIPE_PRICE_AGENCY
```
**Value:**
```
price_1SOqiklGaH1td4JMON17yzmP
```

---

## Quick Checklist

- [ ] Go to Vercel Dashboard
- [ ] Select project: `creatorflow-live`
- [ ] Settings → Environment Variables
- [ ] Add all 10 variables above
- [ ] **IMPORTANT**: Select "Production" environment for each
- [ ] Save all variables
- [ ] Redeploy project

---

**Total Variables to Add: 10**

1. `NEXT_PUBLIC_APP_URL`
2. `TURSO_DATABASE_URL`
3. `TURSO_AUTH_TOKEN`
4. `JWT_SECRET`
5. `STRIPE_SECRET_KEY`
6. `STRIPE_WEBHOOK_SECRET`
7. `STRIPE_PRICE_STARTER`
8. `STRIPE_PRICE_GROWTH`
9. `STRIPE_PRICE_PRO`
10. `STRIPE_PRICE_BUSINESS`
11. `STRIPE_PRICE_AGENCY`

---

**Next Step:** After adding variables, redeploy and test!

