# 📝 Stripe Setup - Values to Save

**Fill this out as you complete Step 1, then use these values in Step 4 (Vercel Environment Variables)**

---

## Stripe API Keys

```
STRIPE_SECRET_KEY = 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
```

```
STRIPE_WEBHOOK_SECRET = whsec_J0hMDb0ahvxo4qyt62zEQyvCZJdKiG2K
```

---

## Stripe Price IDs (Create 5 Products)

### Starter Plan ($19/month)
```
STRIPE_PRICE_STARTER = price_1SOqFjIGaH1td4JMBwcypWwV
```

### Growth Plan ($29/month)
```
STRIPE_PRICE_GROWTH = price_1SOqUCIGaH1td4JMMG0dRT1V
```

### Pro Plan ($39/month)
```
STRIPE_PRICE_PRO = price_1SOqdilGaH1td4JMxVVWSaBR
```

### Business Plan ($49/month)
```
STRIPE_PRICE_BUSINESS = price_1SOqgTIGaH1td4JMUMgZxq89
```

### Agency Plan ($99/month)
```
STRIPE_PRICE_AGENCY = price_1SOqiklGaH1td4JMON17yzmP
```

---

## Webhook Endpoint

**Webhook URL to add in Stripe:**
```
https://creatorflow.ai/api/stripe/webhook
```

**Webhook Events to Select:**
- ✅ checkout.session.completed
- ✅ customer.subscription.created
- ✅ customer.subscription.updated
- ✅ invoice.payment_failed

---

## Quick Checklist

- [ ] Logged into Stripe Dashboard
- [ ] Switched to Live Mode (top-right toggle)
- [ ] Created 5 products (Starter, Growth, Pro, Business, Agency)
- [ ] Copied all 5 Price IDs
- [ ] Copied Secret Key (sk_live_...)
- [ ] Created webhook endpoint
- [ ] Selected all 4 events
- [ ] Copied webhook secret (whsec_...)
- [ ] All values written above

---

**Next Step:** Go to Step 2 (Turso Database Setup)

