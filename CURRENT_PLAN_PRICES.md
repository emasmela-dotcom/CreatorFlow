# CreatorFlow365 — plan prices (source of truth)

**Aligned with:** `src/components/PlanSelection.tsx` (and homepage pricing cards).

**Last updated:** May 2026

---

## Monthly prices & Stripe env vars

Internal Stripe/checkout keys use **plan ids** (`starter`, `growth`, `pro`, `business`, `agency`). Display names on the site differ for some tiers.

| Display name (UI) | Internal id | /month | Env var for Stripe Price ID |
|-------------------|------------|--------|-----------------------------|
| Starter | `starter` | **$9** | `STRIPE_PRICE_STARTER` |
| Essential | `growth` | **$19** | `STRIPE_PRICE_GROWTH` |
| Creator | `pro` | **$49** | `STRIPE_PRICE_PRO` |
| Professional | `business` | **$79** | `STRIPE_PRICE_BUSINESS` |
| Business | `agency` | **$149** | `STRIPE_PRICE_AGENCY` |

Create **one Stripe recurring price per row** and paste each `price_…` ID into Vercel Production.

---

## Changing prices

1. Change amounts in **Stripe** (new prices) and update the five `STRIPE_PRICE_*` env vars.  
2. Update **`PlanSelection.tsx`** (and any marketing copy such as `src/app/page.tsx`) so the site matches Stripe.  
3. Redeploy.

---

## Older docs

Files that still mention **$5 / creatorflow.ai / Turso** are obsolete unless updated explicitly—trust **this file** + **`PRE_LAUNCH_STATUS.md`** + code.
