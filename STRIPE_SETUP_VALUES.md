# 📝 Stripe Setup - Values to Save

**Fill this out as you complete Step 1, then use these values in Step 4 (Vercel Environment Variables)**

---

## Stripe API Keys

```
STRIPE_SECRET_KEY = sk_live____________________
```

```
STRIPE_WEBHOOK_SECRET = whsec____________________
```

---

## Stripe Price IDs (Create 5 Products)

### Starter Plan ($19/month)
```
STRIPE_PRICE_STARTER = price____________________
```

### Growth Plan ($29/month)
```
STRIPE_PRICE_GROWTH = price____________________
```

### Pro Plan ($39/month)
```
STRIPE_PRICE_PRO = price____________________
```

### Business Plan ($49/month)
```
STRIPE_PRICE_BUSINESS = price____________________
```

### Agency Plan ($99/month)
```
STRIPE_PRICE_AGENCY = price____________________
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

