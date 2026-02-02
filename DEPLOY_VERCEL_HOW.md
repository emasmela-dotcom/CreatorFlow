# How to Deploy CreatorFlow365 to Vercel

Get your latest code (signup/trial flow, branding, etc.) live at **creatorflow365.com**.

---

## If Vercel is already connected to this repo (GitHub)

Then **every push to your main branch deploys automatically.**

1. **Commit and push your latest code:**
   ```bash
   cd /Users/ericmasmela/CreatorFlow
   git add .
   git commit -m "Latest: signup flow, branding, email setup"
   git push origin main
   ```
2. **Wait 1–2 minutes.** Vercel will build and deploy.
3. **Check:** [vercel.com/dashboard](https://vercel.com/dashboard) → your project → **Deployments**. When the latest deployment shows “Ready,” the live site is updated.
4. **Domain:** In Vercel → your project → **Settings** → **Domains**, make sure **creatorflow365.com** (and **www.creatorflow365.com** if you use it) is added and points to this project. If it’s already there, no change needed.

That’s it. The live site at creatorflow365.com will serve your latest code.

---

## If this is the first time connecting this repo to Vercel

1. **Push your code to GitHub** (if you haven’t):
   ```bash
   cd /Users/ericmasmela/CreatorFlow
   git add .
   git commit -m "CreatorFlow365 production"
   git push origin main
   ```
2. **Connect the repo to Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - **Add New** → **Project**
   - **Import** your Git repository (e.g. GitHub → select **CreatorFlow**)
   - Leave defaults (Framework: Next.js, Root: `./`) and click **Deploy**
3. **Add environment variables** (required for auth, DB, Stripe, etc.):
   - Project → **Settings** → **Environment Variables**
   - Add at least: `DATABASE_URL`, `JWT_SECRET`, and any Stripe/Resend vars you use (see `ENVIRONMENT_VARIABLES.md` or `VERCEL_ENV_VARS.md` in this repo)
   - Save, then trigger **Redeploy** from the **Deployments** tab
4. **Add your domain:**
   - Project → **Settings** → **Domains**
   - Add **creatorflow365.com** and **www.creatorflow365.com**
   - Follow Vercel’s instructions to add the DNS records at your domain registrar (or Cloudflare). Until DNS points to Vercel, the custom domain won’t work.

After that, every **git push** to the connected branch will deploy automatically (same as the first section).

---

## Optional: Deploy from your machine with Vercel CLI

If you have the Vercel CLI and the project already linked:

```bash
cd /Users/ericmasmela/CreatorFlow
vercel --prod
```

This deploys the current folder to production without using GitHub. Most people prefer **push to GitHub → auto deploy** so the dashboard shows history and logs.

---

## Quick checklist

| Step | Done |
|------|------|
| Code pushed to GitHub (`git push origin main`) | ☐ |
| Vercel project connected to this repo | ☐ |
| Env vars set in Vercel (e.g. `DATABASE_URL`, `JWT_SECRET`, Stripe, Resend) | ☐ |
| Domain creatorflow365.com (and www) added in Vercel → Domains | ☐ |
| DNS for creatorflow365.com points to Vercel (as per Vercel’s Domains page) | ☐ |
| Latest deployment “Ready” in Vercel dashboard | ☐ |

When all are done, the live site at **creatorflow365.com** is running your latest code.
