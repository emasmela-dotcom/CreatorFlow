# How to Set Up the Database

Run **one** of these so tables and columns (including `credits_balance`) are created.

---

## Option 1: Call the init endpoint (easiest)

**Local (app running on port 3000):**
```bash
curl http://localhost:3000/api/init-db
```

**Production (creatorflow365.com):**
```bash
curl https://www.creatorflow365.com/api/init-db
```

Or open in a browser:  
`https://www.creatorflow365.com/api/init-db`

You should see: `{"success":true,"message":"Database initialized successfully"}`

---

## Option 2: Call the setup endpoint (creates tables + verifies)

**Local:**
```bash
curl -X POST http://localhost:3000/api/db/setup
```

**Production:**
```bash
curl -X POST https://www.creatorflow365.com/api/db/setup
```

Returns JSON with `success`, `tables`, and any errors.

---

## Option 3: Run the migration script

From the project root:

**Production (defaults to creatorflow365.com):**
```bash
node scripts/run-migration.js
```

**Or with a custom base URL:**
```bash
BASE_URL=https://www.creatorflow365.com node scripts/run-migration.js
```

**Or use the production setup script:**
```bash
BASE_URL=https://www.creatorflow365.com node scripts/setup-production-db.js
```

---

## What runs

- **`/api/init-db`** (GET) and **`/api/db/setup`** (POST) both call `initDatabase()` in `src/lib/db.ts`.
- `initDatabase()` creates the `users` table (if missing), then runs migrations: for each new column (e.g. `credits_balance`), it tries to add it if it doesn’t exist.
- Safe to run multiple times; existing tables/columns are left as-is.

---

## Before you run it

1. **Env:** `DATABASE_URL` or `NEON_DATABASE_URL` must be set (e.g. in Vercel → Project → Settings → Environment Variables).
2. **App:** The app must be deployed and running (or run locally with `npm run dev`) so the endpoints are available.
