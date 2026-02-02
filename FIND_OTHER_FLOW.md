# How to find where the “other” flow lives

You’re seeing a flow on creatorflow365.com that **isn’t in this repo**:

- Red **“Not authenticated”** box  
- **“7-day free trial”** and **“No credit card required”**  
- Plans: **Starter $9**, **Essential $19**, **Creator $79**  
- Loop: pick plan → confirm → choose plan → confirm  

This repo has: 15-day trial, plans Free / Starter / Growth / Pro / Business / Agency, different prices, and no “Not authenticated” or “Essential”/“Creator” plan names.

Use these checks to find the other flow:

---

## 1. Vercel (or your host)

- Log in to [vercel.com](https://vercel.com) (or wherever creatorflow365.com is hosted).
- Find the **project** that has the domain **creatorflow365.com** (or www).
- Open **Settings → Domains** and **Deployments**.
- Check the **connected Git repo** and **root directory**.  
  - If it’s this repo only → the other flow might be from a different **branch**, or from an **override** (e.g. different framework/root).
  - If you see **two projects** both pointing at creatorflow365.com (e.g. one for `/` and one for a path), the other flow may be in the second project’s repo.

So: **which repo/branch is actually deployed for creatorflow365.com?**

---

## 2. Other folders / repos on your machine

- Search your computer for:
  - **“Not authenticated”**
  - **“7-day free trial”**
  - **“Essential”** and **“Creator”** as plan names
  - **“CreatorFlow365”** or **“creatorflow365”** as folder/repo name
- Common places: `~/Projects`, `~/Documents`, `~/Desktop`, another clone of “CreatorFlow” with a different name.

That will point you to the **other codebase** that has that flow.

---

## 3. On the live site (quick check)

- Open https://www.creatorflow365.com and go to the page that shows “Not authenticated” and the 7-day trial.
- **View page source** (e.g. right‑click → View Page Source) and search for:
  - `Not authenticated`
  - `7-day`
  - `Essential` or `Creator`
- If you find them, it’s an HTML/JS bundle from **that** deployment. The **same** Vercel project might be building from a different repo or branch than you think.

---

## 4. What we fixed in this repo

So that **this** app doesn’t contribute to the loop:

- **Signup → Stripe trial:** If the trial API returns 401, we now show a clear “session expired” message and links to **Sign in** and **Start over (create account)** instead of leaving you stuck.
- **/pricing:** We added a `/pricing` route that redirects to `/#pricing`, so the Stripe cancel URL doesn’t 404.

Once you know which repo/project serves the page with “Not authenticated” and the 7-day trial, we can fix the loop there (e.g. stop redirecting unauthenticated users back into the plan picker, or point “Choose this plan” to this app’s `/select-plan` → `/signup` flow).
