# Agent catchup — CreatorFlow365 (read this first)

**Date:** 2026-08-04  
**Live site:** https://www.creatorflow365.com  
**Repo:** main (pushed)

---

## Eric’s hard rules right now (do not violate)

1. **Do not burn Cursor usage.** Other Models = **100% used**. On-demand = **Disabled**. Cursor Models ~**73%**. Reset ~**Aug 19**. If he runs out of Cursor Models he cannot work on this for 10+ days.
2. **No exceptions** that allow burning usage (not “plain text loopholes,” not “being helpful,” not background agents).
3. If a task would burn usage: **stop, tell Eric, ask what he wants.** He will ask for a **command/prompt** for **outside AI** (e.g. Kimi). Outside AI writes code; agent **places only when Eric says place**.
4. Prompts for outside AI must be **one copy block** and must say **do not rewrite whole files**.
5. Global rules: `~/.cursor/rules/ask-eric-before-any-usage-burn.mdc`, `~/.cursor/rules/cursor-other-models-strict-approval.mdc`.
6. Eric has TBI (1997): short, plain language, one thing at a time.

---

## Product truth (honest)

- **Main job for creators:** Documents — save original once → pick platform → copy formatted. Phone-first.
- **Banner:** “Free while we build. Paid plans with live AI later.”
- **AI during free build:** Groq only (cheap host). **Not** Elon’s Grok (xAI).
- **Daily AI caps (live):** 3 runs per user per day; 400 site-wide per day. Settings in `src/lib/aiUsagePolicy.ts`. Override map for support to raise one user.
- Plan pickers still say prices are hidden (“Free while we build”); “unlimited” wording still exists in plan copy — not cleaned yet.

---

## Groq setup — where things actually are

### Done (code + deploy)

| Item | Commit / note |
|------|----------------|
| Free-build forces **Groq only** when `GROQ_API_KEY` set; ignores `AI_DEFAULT_PROVIDER=openai` | `b4c0cea` — `src/lib/ai/llm.ts` + `FREE_BUILD_PHASE` |
| Daily caps + support override list | `de8f8cb` — `aiUsagePolicy.ts`, `usageTracking.ts` |
| Caption coach **does not** auto-run on typing; only **Run coach** button | `44a7531` — burned Eric’s 3 runs yesterday by typing before this fix |
| Phone dashboard: Documents first below `lg`; hide More AI tools on small screens | `9f9e149` |
| Phone/laptop honest line on Documents cards | `eae1b5c` |
| Feedback: expired token → clear + ask email (was showing Unauthorized) | `790c16d` |

### Vercel / Groq account (Eric’s side)

- `GROQ_API_KEY` is on Vercel (seen in env list).
- Default model in code: `GROQ_MODEL` or **`llama-3.1-8b-instant`** (good free-tier ceiling: ~500K tokens/day, 14.4K requests/day per Groq Limits screen).
- Eric’s Groq Limits screenshot (2026-08-04): org shows Developer-plan-style limits table; `llama-3.1-8b-instant` is the right model for free-build volume.
- Optional: set Vercel `AI_DEFAULT_PROVIDER` = `groq` (belt and suspenders; free-build code should already ignore openai).

### NOT finished / NOT verified

- ~~Live proof Caption coach via Groq~~ **Done 2026-08-04:** `GROQ_API_KEY` created in Groq console, set on Vercel Production, redeployed; agent + Eric Run coach tests return live AI (provider groq).
- Do **not** run extra live Groq tests unless Eric explicitly says yes (uses Groq free quota).
- Honest “what’s live” page for creators: discussed, **not** built (Kimi invented a page with false “no trial countdown” — dashboard still shows trial days; do not post that lie).
- Phone simplification Step 1 is live; further simplification paused.
- Tagline Eric is trying to remember for homepage: **not** the existing ones; he will say when it comes back. Existing: “Stop juggling apps. Start growing.” / “One draft, many exports.”

---

## How to continue Groq setup (next agent)

1. Ask Eric: confirm Vercel `GROQ_API_KEY` + optional `AI_DEFAULT_PROVIDER=groq`.
2. Ask Eric to test **himself** (no agent Cursor burn): Caption coach → short text → **Run coach** once → report success or exact error.
3. If code change needed: give Kimi prompt only; place when he says; commit/push only when he asks (or when project rules he re-enables say so — default now: ask first).
4. Do not confuse **Groq** (site AI host) with **Grok** (Elon / Cursor chat model).

---

## Important files

- `src/lib/aiUsagePolicy.ts` — free-build flags + daily limits  
- `src/lib/usageTracking.ts` — `canMakeAICall` daily checks  
- `src/lib/ai/llm.ts` — provider order (Groq in free build)  
- `src/components/bots/ContentAssistantBot.tsx` — Run coach button  
- `src/app/dashboard/page.tsx` — phone Documents card + copy  
- `src/components/FeedbackButton.tsx` — expired session handling  
- `MARKETING_READY.md` — checklist (AI keys note may be stale; Groq key is set)

---

## One-line status for Eric

Groq free-build is **confirmed working** on live (key + redeploy + Eric Run coach test). Optional: Vercel `AI_DEFAULT_PROVIDER=groq` (not required when key is set).
