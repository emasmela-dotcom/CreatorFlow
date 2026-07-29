# Agent catch-up — CreatorFlow365

**Workspace:** `/Users/ericmasmela/CreatorFlow`  
**Live site:** https://www.creatorflow365.com  
**Owner:** Eric (TBI 1997 — short plain answers, one thing at a time)

Use this when starting a **new** agent chat. Do not mix in other repos (ToolMarket, CareConnect, etc.) unless Eric names them.

---

## Product truth (must match copy)

- User **already has** the content.
- User **picks platforms**.
- CreatorFlow **adjusts/formats** that content for each platform.
- It does **not** invent/create the user’s content from scratch.

Homepage promise (live):  
*You already have the content. You pick the platforms. CreatorFlow adjusts it to each one’s format.*

How it works steps: **Bring your content** → **Select platforms** → **Publish formatted**.

---

## Hard rules Eric enforces

1. **Only the open project** — CreatorFlow only unless he names another.
2. **Do not write full app code** — give a paste-ready outside-AI (Kimi) prompt + file; Eric brings code back; agent **places** it.
3. When giving a prompt: include **everything to paste** (instructions + file). Do not make him hunt files.
4. **Do not call work “done”** until finished **and** self-tested (live/end result). API `ok` ≠ email arrived.
5. No unsolicited polish / other projects / invented features.
6. Significant CreatorFlow site changes → commit + push to `main` after placing (unless he says not to).

---

## What recently shipped (this thread)

| Change | Status |
|--------|--------|
| Homepage no longer auto-redirects `/` → `/dashboard` | Pushed (`22ebfb2`) |
| Homepage tightened (less bulky layout) | Pushed |
| Hero product promise line | Pushed |
| How it works step 1 = Bring your content | Pushed |
| `PRE_MARKETING_CHECKLIST.md` | Exists — work checklist before marketing |
| Game-Changers: When / Why on cards; How in detail panels | Pushed (`1af4b0f`) |
| A/B Testing + Content Series | Still **coming soon** (honest) |

**Paste packs (for Kimi):**  
- `PASTE_THIS_TO_KIMI_GameChangerFeatures.txt`  
- `KIMI_PASTE_GAME_CHANGERS.md`  

---

## Known gaps / honesty

- **Support mail on CreatorFlow:** live `/api/support` previously returned “not set up” without `RESEND_API_KEY` on Vercel. Do not claim support email works until verified in inbox.
- Game-Changer tools: UI + help text improved; **do not claim** every tool is real AI / fully working without checking the API. Some are heuristic, empty, or “coming soon.”
- Pre-marketing list (`PRE_MARKETING_CHECKLIST.md`) still mostly unchecked — homepage flow was the main progress.

---

## Key URLs

- Home (landing): https://www.creatorflow365.com  
- Dashboard / Game-Changers: https://www.creatorflow365.com/dashboard (tab: Game-Changers)  
- Create / format flow: https://www.creatorflow365.com/create  
- Support: https://www.creatorflow365.com/support  

---

## Key files

- `src/app/page.tsx` — homepage  
- `src/app/create/page.tsx` — platform format selection  
- `src/components/GameChangerFeatures.tsx` — Game-Changers UI + help  
- `PRE_MARKETING_CHECKLIST.md` — before ads/outreach  
- `src/app/api/support/route.ts` — support form → `apputilitybuilder@gmail.com` (needs Resend env)

---

## How to work with Eric next

1. Answer / explain first if he asks a question.  
2. If he wants a code change: **prompt for Kimi** with full paste content → he brings code → **place** → verify → commit/push.  
3. One issue at a time.  
4. Stay on CreatorFlow unless he names another project.
