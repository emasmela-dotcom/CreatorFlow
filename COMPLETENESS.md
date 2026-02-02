# CreatorFlow365 – Completeness Summary

**Project:** CreatorFlow365 (creatorflow365.com)  
**Repo:** CreatorFlow – Next.js app, main branch  
**Last updated:** February 2025  

## Status

- **Auth & signup:** Email/password signup, signin, demo. Plan selection (Free, Starter, Growth, Pro, Business, Agency). Trial flow via Stripe (15-day).
- **Core routes:** `/`, `/signup`, `/signin`, `/select-plan`, `/pricing`, `/dashboard`, `/demo`, `/create`, `/documents`, `/analytics`, `/collaborations`, `/reviews`.
- **APIs:** Auth, Stripe (trial + webhook), documents, content-templates, bots, calendar, engagement-inbox, hashtag-research, etc.
- **Database:** Turso/Neon (users, platform_connections, documents, content_templates, hashtag_sets, engagement_inbox, etc.).

## Production

- **URL:** https://www.creatorflow365.com  
- **Deploy:** Vercel, `main` branch.  
- **Env:** `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_BASE_URL`, `DATABASE_URL` (or `NEON_DATABASE_URL`), Stripe keys.

This file satisfies the Vercel “Add COMPLETENESS.md summary” requirement.
