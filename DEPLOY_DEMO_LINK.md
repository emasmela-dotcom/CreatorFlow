# Demo Link for Friend (Different Network)

Your friend needs a public URL to access the demo. Here are two options:

## Option 1: Quick Solution - ngrok (Temporary Public URL)

### Install ngrok:
```bash
# macOS
brew install ngrok

# Or download from: https://ngrok.com/download
```

### Start ngrok:
1. Make sure your Next.js server is running: `npm run dev`
2. In a new terminal, run:
```bash
ngrok http 3000
```

3. ngrok will give you a public URL like: `https://abc123.ngrok.io`
4. Share this URL with your friend: `https://abc123.ngrok.io/demo`

**Note:** Free ngrok URLs expire after 2 hours. For longer access, sign up for a free ngrok account.

---

## Option 2: Permanent Solution - Deploy to Vercel (Recommended)

### Quick Deploy Steps:

1. **Install Vercel CLI** (if not installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Follow prompts:**
   - Link to existing project? **No** (first time)
   - Project name: **creatorflow** (or your choice)
   - Directory: **./** (current directory)
   - Override settings? **No**

5. **Set Environment Variables** (in Vercel dashboard):
   - Go to your project settings → Environment Variables
   - Add all variables from your `.env.local`:
     - `DATABASE_URL` (or `TURSO_DATABASE_URL`)
     - `JWT_SECRET`
     - `STRIPE_SECRET_KEY` (if using Stripe)
     - `STRIPE_PRICE_STARTER`, etc.
     - Any other env vars

6. **Get your demo URL:**
   - Vercel will give you: `https://creatorflow.vercel.app`
   - Demo link: `https://creatorflow.vercel.app/demo`

### After Deployment:
- Your app will be live at: `https://your-project.vercel.app`
- Demo link: `https://your-project.vercel.app/demo`
- This URL is permanent and works from anywhere

---

## Which Should You Use?

- **ngrok**: If you need it RIGHT NOW (takes 2 minutes)
- **Vercel**: If you want a permanent solution (takes 10 minutes, but worth it)

---

## Important Notes:

1. **Database**: Make sure your database (Neon/Turso) allows connections from Vercel's IPs
2. **Environment Variables**: All secrets must be added to Vercel dashboard
3. **Demo Account**: The demo account (`demo@creatorflow.ai`) will work the same way in production

