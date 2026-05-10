# Spending planner — product spec (imported from ~/Public)

**Source:** Copied from `/Users/ericmasmela/Public/APP_IDEA.md` so it lives with the **CreatorFlow** codebase (same product family as creatorflow365.com; aligns with expenses-related work in the app).

---

# CreatorFlow365 — Product baseline spec

**Product name (locked):** CreatorFlow365 — one name everywhere (app, marketing, Vercel).

**Document status:** **Locked** — baseline for implementation (2026-05-09). Changes after this date should be a new revision section or a dated amendment note at the bottom.

---

## One-line pitch

An app where people enter **exact costs for exact bills and purchases**, see their **projected total spending for the month**, and get **clear savings options** based on those numbers—not generic advice.

---

## Who it is for

- Households and individuals who want a simple monthly picture without accountant jargon.
- People who prefer **manual, precise amounts** (and optionally connect banks later).

---

## What problem it solves

Most budgeting apps feel abstract. This product focuses on:

1. **Clarity:** "What will this month actually cost me?"
2. **Control:** "Where can I realistically save without guessing?"
3. **Action:** Concrete swaps (cancel/substitute/reduce/re-schedule), prioritized by impact.

---

## Core user journey

1. **Add expenses** item-by-item (amount + what it is + how often it happens).
2. **See monthly projection** with categories and upcoming timing where helpful.
3. **Ask for savings options** based on the user's exact totals (AI-assisted suggestions).
4. **Pick a plan** (optional targets like "save $200 this month").
5. **Track weekly** against the plan with plain-language alerts.

---

## MVP definition (V1)

**Must-have**

- Manual expense entry with recurrence rules (weekly, monthly, yearly → normalized to monthly).
- Monthly projection total + category breakdown.
- Savings suggestion panel grounded in the user's entered items (no hallucinated bills).
- Simple scenarios: "reduce grocery by $X", "cancel subscription Y", "shift payment timing".

**Nice-to-have (if quick)**

- Calendar-style view of upcoming payments.
- Export snapshot (PDF or CSV).

**Explicitly out of scope for V1**

- Bank linking (can be V2).
- Investment advice.
- Credit score optimization promises.

---

## How AI fits (public-facing framing)

Positioning for average users:

> "Smart suggestions based on your real numbers."

Behind the scenes (conceptual):

- Classify line items, detect forgotten recurring charges patterns, rank savings ideas by impact vs effort.
- Generate plain-language explanations and follow-up questions when inputs are incomplete.

**Quantum angle (optional, not consumer-marketed):** advanced optimization for constrained savings scenarios can stay invisible under "best plan" generation—only mention if you have measurable wins vs classical baselines.

---

## Trust, privacy, and compliance (early checklist)

- Clear statement: suggestions are informational, not financial, legal, or tax advice.
- Minimal data collection in V1 (manual entry reduces sensitive surface area).
- If/when adding bank connections: strong consent + security posture + regulated-partner path.

---

## Success metrics (early)

- Weekly active users completing a full monthly projection.
- % of users who apply at least one savings action from suggestions.
- Retention after first "month closed" cycle.

---

## Deferred decisions (non-blocking for V1 build)

These do **not** invalidate the locked V1 scope above; decide during UX/monetization work without rewriting core product definition.

| Decision | Options |
|----------|---------|
| **Brand tone** | Friendly coach vs neutral planner vs premium concierge |
| **Monetization** | Freemium manual-only vs paid "bank sync" tier later |
| **Platforms** | Web-first (Next.js on Vercel) vs mobile-first |

---

## Implementation handoff

Build against **MVP definition (V1)** in this doc. When product scope changes materially, append a **Revision** subsection below with date and what changed.

---

## Revision history

| Date | Change |
|------|--------|
| 2026-05-09 | Baseline locked; product name CreatorFlow365; V1 scope + journey + AI framing + trust checklist finalized. |
