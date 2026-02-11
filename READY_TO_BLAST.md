# Ready to Blast – CreatorFlow365

**Site:** https://www.creatorflow365.com  
**Build:** ✅ Passes (verified).

---

## Do these 3 things, then go live

| # | What | Where |
|---|------|--------|
| 1 | **Confirm Stripe for Production** | Vercel → Project → Settings → Environment Variables → **Production**. Ensure `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and all five `STRIPE_PRICE_*` (Starter, Growth, Pro, Business, Agency) are set. Stripe Dashboard: products/prices match site ($9, $19, $49, $79, $149). |
| 2 | **Smoke test** | Sign up → pick a plan → checkout or start trial. Dashboard → Credit Bundles → buy $5 → confirm credits update. |
| 3 | **Push latest** | If you have uncommitted changes: `git add -A && git commit -m "Launch prep" && git push origin main`. Then Vercel deploys. |

---

## Then: blast it out

- Content (blog, social) about CreatorFlow365.
- Outreach to creators (email, DMs, communities).
- Paid or organic (SEO, Product Hunt, etc.) as you prefer.

---

**Docs:** PROJECT_STATUS.md, LAUNCH_CHECKLIST_FINAL.md, COMPLETION_LIST.md.
