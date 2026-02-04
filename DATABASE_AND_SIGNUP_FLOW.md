# Database and signup – what happens in real time

## What happens when someone signs up

1. User visits **www.creatorflow365.com/signup**, picks a plan, enters email/password, clicks **Start Free Trial**.
2. The browser sends a request to your app on **Vercel** (Production).
3. The app runs **`/api/auth`** (POST). That code reads **`DATABASE_URL`** from the environment (Vercel injects it for that deployment).
4. The app connects to the **Neon** database at that URL and runs:
   ```sql
   INSERT INTO users (id, email, password_hash, subscription_tier, created_at) VALUES (...)
   ```
5. If that database’s **`users`** table does **not** have a **`subscription_tier`** column → you see:  
   **`column "subscription_tier" of relation "users" does not exist`**.

So in real time: **Vercel uses `DATABASE_URL` → connects to one Neon database → that database must have `users.subscription_tier`.**

---

## Proper one-time setup (single source of truth)

### 1. Pick one Neon branch for production

- Use the **production** branch in Neon (or whichever you want for www.creatorflow365.com).
- All production traffic will use this branch.

### 2. Make sure that branch has the schema

- In Neon → **Branches** → click that branch (e.g. **production**).
- **SQL Editor** → run the migration so **`users`** has **`subscription_tier`** (and any other columns your app needs).  
  Example (run once):

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50);
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_subscription_tier_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_subscription_tier_check1;
ALTER TABLE users DROP CONSTRAINT IF EXISTS subscription_tier_check;
ALTER TABLE users ADD CONSTRAINT users_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'starter', 'growth', 'pro', 'business', 'agency'));
```

- If **`users`** doesn’t exist on that branch, create it first (e.g. with a `CREATE TABLE users (...)` that includes **`subscription_tier`**).

### 3. Point Vercel at that exact database

- In Neon, on **that same branch**, open **Connection details** / **Connect** and copy the **connection string** (`postgresql://...`).
- In **Vercel** → your project → **Settings** → **Environment Variables**:
  - **Name:** `DATABASE_URL`
  - **Value:** paste that connection string (and only that one).
  - **Environments:** **Production** (so only the live site uses it).
- **Save.**

### 4. Redeploy Production

- **Deployments** → latest **Production** deployment → **Redeploy**.
- Wait until it’s **Ready**.  
  After this, the app will use the new `DATABASE_URL` and connect to the Neon branch you set up.

### 5. Verify in real time

- Open: **https://www.creatorflow365.com/api/db/health**
- You should see:
  - **`dbHostRedacted`** – matches the host from the connection string you pasted (e.g. `ep-dry-waterfall-ahwpqcaw-pooler`).
  - **`usersHasSubscriptionTier: true`** – so signup will work.

If **`usersHasSubscriptionTier`** is **false**, the DB that `DATABASE_URL` points to still doesn’t have the column → run the SQL on **that** Neon branch (the one whose connection string is in Vercel).

---

## Summary

- **Real time:** Signup uses **`DATABASE_URL`** → one Neon DB → that DB must have **`users.subscription_tier`**.
- **Proper setup:** One Neon branch for production → run migration there → put **that branch’s** connection string in Vercel **`DATABASE_URL`** (Production only) → redeploy → check **/api/db/health** to confirm **`usersHasSubscriptionTier`** and **`dbHostRedacted`**.
