# Database Setup - Turso (LibSQL)

CreatorFlow now uses **Turso** - a free, serverless SQLite database that never pauses.

## Why Turso?

- ✅ **Free tier** with generous limits
- ✅ **Never pauses** - always available
- ✅ **Serverless** - scales automatically
- ✅ **SQLite compatible** - familiar SQL syntax
- ✅ **Fast** - edge-replicated database

## Setup Instructions

### 1. Create a Turso Account

1. Go to [turso.tech](https://turso.tech)
2. Sign up for a free account
3. Create a new database

### 2. Get Your Database Credentials

After creating your database:

1. Go to your database dashboard
2. Copy the **Database URL** (looks like: `libsql://your-db-name-xxxx.turso.io`)
3. Generate an **Auth Token** from the settings

### 3. Set Environment Variables

Add these to your `.env.local` file:

```env
TURSO_DATABASE_URL=libsql://your-db-name-xxxx.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
JWT_SECRET=your-random-secret-key-here
```

### 4. Initialize Database Schema

The database schema will be automatically created on first use, or you can run:

```bash
npm run dev
```

The `initDatabase()` function in `src/lib/db.ts` will create all necessary tables.

### 5. Install Dependencies

```bash
npm install
```

## Database Tables

The following tables are automatically created:

- **users** - User accounts
- **content_posts** - Social media posts
- **analytics** - Analytics metrics
- **project_backups** - Project save points for trial system

## Local Development

For local development, you can use a local SQLite file. The code will automatically use `file:local.db` if Turso credentials are not provided.

## Migration from Supabase

All Supabase code has been replaced with Turso. The API endpoints remain the same, but now use the new database.

