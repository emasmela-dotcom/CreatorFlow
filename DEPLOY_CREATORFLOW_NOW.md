# Deploy CreatorFlow - Step by Step

## The Issue
You're seeing "YourApp" instead of CreatorFlow. Let's deploy CreatorFlow properly.

## Steps to Deploy CreatorFlow

### Step 1: Login to Vercel
```bash
vercel login
```
(This opens your browser to authenticate)

### Step 2: Make sure you're in CreatorFlow directory
```bash
pwd
# Should show: /Users/ericmasmela/CreatorFlow
```

### Step 3: Deploy CreatorFlow
```bash
vercel
```

**When it asks:**
- "Set up and deploy?" → **Y**
- "Link to existing project?" → **N** (first time)
- "What's your project's name?" → **creatorflow** (or press Enter)
- "In which directory is your code located?" → **Press Enter** (./)
- "Want to override the settings?" → **N**

### Step 4: Get Your URL
After deployment, Vercel will show:
```
✅ Production: https://creatorflow-xxxxx.vercel.app
```

**That's your CreatorFlow URL!**

### Step 5: Test Demo Link
Visit: `https://creatorflow-xxxxx.vercel.app/demo`

---

## Why You Saw "YourApp"

The URL `https://your-app.vercel.app` is a placeholder or different project. 

**CreatorFlow will have its own URL like:**
- `https://creatorflow-xxxxx.vercel.app`
- Or `https://creatorflow.vercel.app` (if available)

---

## After Deployment

1. **Set Environment Variables** in Vercel Dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`

2. **Test the demo:**
   - Visit: `https://your-creatorflow-url.vercel.app/demo`
   - Should auto-login and show CreatorFlow dashboard

3. **Share with friend:**
   - Same URL: `https://your-creatorflow-url.vercel.app/demo`

---

**Ready to deploy? Run `vercel login` then `vercel`!**

