# Agent catch-up — CreatorFlow365

**Workspace:** `/Users/ericmasmela/CreatorFlow`  
**Live site:** https://www.creatorflow365.com  
**Owner:** Eric (TBI 1997 — short plain answers, **one thing at a time**, do not overload)

Use this when starting a **new** agent chat. Do not mix in other repos (ToolMarket, CareConnect, ReadAI, etc.) unless Eric **names** them.

---

## Product truth (must match copy)

- User **already has** the content.
- User **picks platforms**.
- CreatorFlow **adjusts/formats** that content for each platform.
- It does **not** invent/create the user’s content from scratch.

Homepage promise (live):  
*You already have the content. You pick the platforms. CreatorFlow adjusts it to each one’s format.*

How it works: **Bring your content** → **Select platforms** → **Publish formatted**.

**Originals vs formatted (important):**
- Eric wants **original** content saved for later / reminders (by name) — not a DB full of formatted-per-platform copies.
- **Save Draft** on `/create` now saves the **original once** into **Documents** (`POST /api/documents` with title + content). It does **not** write per-platform rows to `content_posts` for that save.
- Schedule / Publish still use the existing posts flow.
- Documents library: https://www.creatorflow365.com/documents

---

## Hard rules Eric enforces

1. **Only the open project** — CreatorFlow only unless he names another.
2. **Do not write full app code** — give a paste-ready outside-AI (Kimi) prompt; Eric brings code back; agent **places** it. For tiny glue (one notice, footer tweak), placing into the **real existing file** is OK — do **not** accept a Kimi full-page rewrite that uses wrong auth/UI (next-auth, shadcn) when CreatorFlow uses JWT + existing gray-900 pages.
3. When giving a prompt: include **everything to paste**. Do not make him hunt files. Prefer **small** pastes (Kimi truncates long dumps).
4. **Do not call work “done”** until finished **and** self-tested on the real end result. Site said “sent” ≠ email in inbox.
5. No unsolicited polish / other projects / invented features.
6. Significant site changes → commit + push `main` (unless he says not to).
7. **Do not burn usage** (browser automation, paid APIs) when a short answer or Eric’s screenshot is enough. Ask before Resend sends / metered tools.
8. Keep replies short. If Eric says slow down / too much — stop and wait.

---

## What recently shipped (through this thread)

| Change | Status |
|--------|--------|
| Homepage no longer auto-redirects `/` → `/dashboard` | Pushed |
| Homepage product promise + How it works (Bring your content) | Pushed |
| Game-Changers: When / Why on cards; How in panels | Pushed |
| A/B Testing + Content Series | Still **coming soon** (honest) |
| **Credits / credit packs dropped** — no buy-credits, no credit badges; plan upgrade only | Pushed (`1f5028d` area) |
| Deleted `src/lib/creditBundles.ts` and `/api/user/purchase-credits` | Done |
| Create **Save Draft** → Documents (original + required name), not `content_posts` | Pushed (`83fbddb`) |
| Footer like ReadAI: **© CreatorFlow365** + **Contact support** underneath | Pushed |
| Footer on **every page** via `src/app/layout.tsx` → `SeoSiteFooter` | Pushed (`0f3005a`) |
| Support form Resend errors surfaced (no fake success) | Pushed (`07e34ee`) |
| **Support mail verified end-to-end** (both inboxes received) | **Working** |

**Paste packs (Kimi):**  
- `PASTE_THIS_TO_KIMI_DropCredits.txt`  
- `PASTE_THIS_TO_KIMI_GameChangerFeatures.txt`  
- `KIMI_PASTE_GAME_CHANGERS.md`

---

## Support / Resend (current truth)

- Form: https://www.creatorflow365.com/support  
- Footer **Contact support** → `/support`  
- Inbox: **apputilitybuilder@gmail.com** (`SUPPORT_TO_EMAIL` default)  
- User gets a confirmation at the email they enter  
- Vercel: `RESEND_API_KEY` set  
- Resend domain **creatorflow365.com** is **Verified** (DNS via Vercel auto-configure)  
- From address uses `support@creatorflow365.com` (default in code / `RESEND_FROM_EMAIL`)  
- Eric removed **careconnect-24-7.com** from Resend to free the free-plan **1 domain** slot for CreatorFlow. CareConnect Resend mail will not work until that domain is re-added or he upgrades Resend.

**Do not claim support broken** unless a new test fails.

---

## Discussed next (NOT built yet)

Talked about; do **not** implement unless Eric asks:

1. **Feedback bubble** (always-available feedback)  
2. **Reviews tab** — real reviews only; **no scraped / pulled** review content from elsewhere  
3. Promo: **first 10 creators** get **1 month free** (formatting included) for a **posted review** — enforce with seat count + review proof + free-month flag (manual approve OK at first)

---

## Known gaps / honesty

- Game-Changer tools: do **not** claim every tool is real AI / fully working without checking APIs. Some heuristic / empty / coming soon.
- `PRE_MARKETING_CHECKLIST.md` still mostly unchecked.
- Neon stores users + `content_posts` + `documents`; prefer Documents for named originals.

---

## Key URLs

- Home: https://www.creatorflow365.com  
- Dashboard: https://www.creatorflow365.com/dashboard (Game-Changers tab)  
- Create: https://www.creatorflow365.com/create  
- Documents: https://www.creatorflow365.com/documents  
- Support: https://www.creatorflow365.com/support  
- Reviews page exists: https://www.creatorflow365.com/reviews  

---

## Key files

- `src/app/layout.tsx` — global `SeoSiteFooter`  
- `src/components/SeoSiteFooter.tsx` — © + Contact support  
- `src/app/page.tsx` — homepage  
- `src/app/create/page.tsx` — format flow; Save Draft → Documents  
- `src/app/api/documents/route.ts` — named original storage  
- `src/app/api/support/route.ts` — support → apputilitybuilder@gmail.com  
- `src/components/GameChangerFeatures.tsx` — Game-Changers UI  
- `PRE_MARKETING_CHECKLIST.md` — pre-marketing checklist  
- `AGENT_CATCHUP.md` — this file  

---

## How to work with Eric next

1. Questions → answer only; no edits.  
2. Code → Kimi paste (complete) → place carefully into real files → verify → commit/push.  
3. One issue at a time.  
4. Stay on CreatorFlow unless he names another project.  
5. Prefer less process; he has said agents create too much work / burn too much usage.
