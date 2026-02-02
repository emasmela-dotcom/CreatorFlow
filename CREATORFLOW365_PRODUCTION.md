# CreatorFlow365 Production

## Production URL

**Live site:** [https://www.creatorflow365.com](https://www.creatorflow365.com)

This is the canonical production URL for CreatorFlow365. The codebase defaults (layout, sitemap, auth, Stripe, demo, etc.) use this URL when `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_BASE_URL` are not set.

---

## Environment Variables (Vercel)

For the deployment that serves creatorflow365.com, set:

| Variable | Value | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://www.creatorflow365.com` | Canonical URL, OG, sitemap, Stripe success/cancel |
| `NEXT_PUBLIC_BASE_URL` | `https://www.creatorflow365.com` | OAuth redirect URIs (connect/callback) |

**Where to set:** Vercel → Project → Settings → Environment Variables (Production).

If these are not set, the app still uses `https://www.creatorflow365.com` as the fallback in code.

---

## Local Development

Use `.env.local` to override for localhost:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Scripts Against Production

Scripts that call the live API (e.g. `run-migration.js`, `setup-production-db.js`, `test-all-tools.js`) default to `https://www.creatorflow365.com`. Override with:

```bash
BASE_URL=https://www.creatorflow365.com node scripts/setup-production-db.js
```

---

*Last updated: February 2025*
