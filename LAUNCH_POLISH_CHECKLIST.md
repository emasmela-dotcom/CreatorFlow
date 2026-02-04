## CreatorFlow – Pre‑Launch Polish Checklist

Use this to clean up final details before heavy marketing.

---

## 1. Stripe & Payments

- [x] Stripe products and prices match the site
  - [x] Starter plan – price and interval correct
  - [x] Essential plan – price and interval correct
  - [x] Creator plan – price and interval correct
  - [x] Professional plan – price and interval correct
  - [x] Business plan – price and interval correct
- [x] Vercel env vars use the correct live price IDs
  - [x] `STRIPE_PRICE_STARTER`
  - [x] `STRIPE_PRICE_GROWTH`
  - [x] `STRIPE_PRICE_PRO`
  - [x] `STRIPE_PRICE_BUSINESS`
  - [x] `STRIPE_PRICE_AGENCY`
- [x] Stripe keys and webhook secret are live and current
  - [x] `STRIPE_SECRET_KEY`
  - [x] `STRIPE_WEBHOOK_SECRET`

---

## 2. Stripe Webhook (Production)

- [x] Webhook endpoint set in Stripe Dashboard  
      `https://www.creatorflow365.com/api/stripe/webhook`
- [x] Events configured:
  - [x] `checkout.session.completed`
  - [x] `customer.subscription.created`
  - [x] `customer.subscription.updated`
  - [x] `invoice.payment_failed`
- [x] Webhook signing secret copied into Vercel (`STRIPE_WEBHOOK_SECRET`)
- [x] App redeployed after any changes to webhook or env vars

---

## 3. Manual Testing / QA

### Auth & Onboarding

- [ ] Sign up new user
- [ ] Log out / log in again
- [ ] Password reset (if applicable)

### Plans & Subscriptions

- [ ] From pricing page, pick each plan at least once
- [ ] Complete Stripe checkout successfully
- [ ] Trial activates correctly for new subscriptions
- [ ] Subscription status looks correct in app (and in Stripe)

### Credit Bundles

- [ ] Purchase $5 bundle and verify credits increase
- [ ] Purchase $10 bundle and verify credits increase
- [ ] Purchase $20 bundle and verify credits increase
- [ ] Confirm Stripe shows correct charges
- [ ] Confirm webhook events received and processed (no errors)

### Cross‑Browser & Devices

- [ ] Core flows tested in Chrome
- [ ] Core flows tested in Safari
- [ ] Core flows tested in Firefox
- [ ] Core flows tested on phone
- [ ] Core flows tested on tablet

### Console & Logs

- [ ] Check browser console on key flows (no unexpected errors)
- [ ] Check Vercel logs for:
  - [ ] Auth routes
  - [ ] Stripe checkout/session endpoints
  - [ ] Stripe webhook handler
- [ ] Fix or note any recurring errors/warnings

---

## 4. UX & Content Polish

- [x] Signup/trial copy updated (no card required, content retention, upgrade/downgrade rules)
- [x] Trial terms & payment step copy aligned with no-card trial and snapshot/restore
- [x] Plan card copy tightened (Professional, Business); AI Bots removed from dashboard, nav, help & feedback
- [x] Privacy page (`/privacy`) created and linked in footer
- [x] Terms of Service page (`/terms`) created and linked in footer
- [x] 404 / not‑found page looks on‑brand and helpful
- [x] Error page copy is clear and non‑scary
- [x] Support / contact path obvious (e.g. footer link)
- [ ] `support@` email forwarding (ImprovMX) tested

---

## 5. Analytics & Monitoring

- [ ] Confirm Google / Vercel analytics are recording real traffic (GA + Vercel script in layout; verify in dashboards)
- [ ] At least one real session shows up in analytics
- [x] Error monitoring plan in place:
  - [x] Use Vercel Logs and Stripe Dashboard → Webhooks for errors
  - [x] Stripe webhook errors monitored in Stripe Dashboard

---

## 6. Light SEO & Share Cards

- [x] Title and description feel accurate for target creators
- [x] Open Graph / Twitter card preview (set in layout; verify by sharing URL)
- [x] `robots.txt` and sitemap look sane (no accidental blocking); sitemap URL fixed to creatorflow365.com; /privacy and /terms added

---

## 7. Launch Day Quick Pass

- [ ] Verify production URL is correct and fast
- [ ] Run one full "first‑time user" journey:
  - [ ] Hit homepage
  - [ ] Understand the value proposition
  - [ ] Sign up, choose plan, go through checkout
  - [ ] Land in dashboard and know what to do next
- [ ] Check for any last‑minute layout or copy issues

