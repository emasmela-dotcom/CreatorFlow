# Pre-Marketing Checklist — CreatorFlow365

**Goal:** Finish this list before sending traffic, ads, or outreach.

**Home URL (must stay on landing, not dashboard):** https://www.creatorflow365.com

Mark each item `[x]` only after it is verified for real (not “should work”).

---

## A. Homepage (must fix before marketing)

- [ ] Homepage content is tightened — less bulky, clearer flow top to bottom
- [ ] First screen: brand, one short promise, one clear CTA (sign up / start trial)
- [ ] Extra sections ordered so a visitor can scan: what it does → platforms/format → pricing → trust → FAQ → final CTA
- [ ] No auto-redirect from `/` to `/dashboard` (browse app is a button only)
- [ ] Wording matches product truth: user writes content; CreatorFlow adjusts format for selected platforms
- [ ] Hard-refresh check on live home: https://www.creatorflow365.com

---

## B. Core visitor paths

- [ ] Sign up works end-to-end (new email → account → expected next screen)
- [ ] Sign in works
- [ ] Pricing on home matches live Stripe prices
- [ ] One plan checkout / trial path works (no broken Stripe)
- [ ] Privacy page loads
- [ ] Terms page loads
- [ ] Support/contact works and mail arrives at **apputilitybuilder@gmail.com**
- [ ] Confirmation email to the visitor works (if promised on the form)
- [ ] Demo / browse path works without forcing signup for viewing

---

## C. Production setup (money + data)

- [ ] Live site is the correct Vercel project for creatorflow365.com
- [ ] `NEXT_PUBLIC_APP_URL` = `https://www.creatorflow365.com`
- [ ] Neon `DATABASE_URL` set on Vercel Production
- [ ] Stripe live keys + webhook to `/api/stripe/webhook`
- [ ] Stripe price IDs match site plans (Starter / Essential / Creator / Professional / Business)
- [ ] One real paid or trial signup verified after webhook

---

## D. Before you spend on marketing

- [ ] One link you’ll use everywhere: `https://www.creatorflow365.com`
- [ ] Homepage says the real offer in plain words
- [ ] You can walk a stranger through: land → understand → sign up → pay/trial
- [ ] No known broken buttons on home / signup / pricing / support

---

## E. After this list is done

Marketing can start (posts, DMs, ads, Product Hunt, etc.) using the one home link above.

Related docs (detail only): `PRE_LAUNCH_STATUS.md`, `LAUNCH_MARKETING_READY.md`, `LAUNCH_STATUS_CHECK.md`
