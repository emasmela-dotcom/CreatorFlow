# Neon Database Setup Guide

## Step 1: Get Your Connection String

1. **In your Neon Console** (you're already there):
   - Look for the **"Connect to your database"** card
   - Click the **"Connect"** button

2. **In the modal that opens**:
   - You'll see connection options
   - Select **"Connection string"** tab (not "Connection pooling" for now)
   - You'll see something like:
     ```
     postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
     ```
   - Click the **copy icon** or **copy button** next to it

3. **Alternative method**:
   - In the left sidebar, click on your branch name (e.g., "production")
   - Look for **"Connection details"** or **"Data API"** section
   - Copy the connection string from there

## Step 2: Add to Your Project

1. **Create `.env.local` file** (if it doesn't exist):
   ```bash
   cd ~/CreatorFlow
   touch .env.local
   ```

2. **Add your connection string**:
   ```env
   DATABASE_URL=postgresql://your-copied-connection-string-here
   JWT_SECRET=your-secure-random-string-here
   ```

3. **Generate JWT_SECRET** (run this once):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use it as your JWT_SECRET

## Step 3: Initialize Database Schema

After setting up your connection string, we'll initialize the database tables using the `initDatabase()` function.

## Troubleshooting

- **Can't find the Connect button?** Look in the left sidebar under your branch → "Connection details"
- **Connection string has placeholders?** Make sure you're copying the actual connection string, not a template
- **Need help?** Share what you see and I can guide you further!

