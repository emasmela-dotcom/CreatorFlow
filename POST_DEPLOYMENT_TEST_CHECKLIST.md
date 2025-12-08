# Post-Deployment Test Checklist

## ✅ After You Deploy - Test These Before Sharing

### 1. **Test Demo Link Yourself First**
```
Visit: https://your-app.vercel.app/demo
```
**Expected:**
- ✅ Page loads
- ✅ Auto-redirects to dashboard
- ✅ You're logged in as demo user
- ✅ Can see sample content (documents, hashtags, templates, posts)

### 2. **Test Homepage Demo Button**
```
Visit: https://your-app.vercel.app/
Click: "Try Demo (No Signup)" button
```
**Expected:**
- ✅ Button works
- ✅ Redirects to `/demo`
- ✅ Auto-logs in

### 3. **Test Demo Account Features**
- ✅ Can navigate dashboard
- ✅ Can see all tabs (Documents, Templates, Hashtags, etc.)
- ✅ Can use AI bots (they should work)
- ✅ Sample content is visible

### 4. **Verify Database Connection**
```
Visit: https://your-app.vercel.app/api/db/health
```
**Expected:**
- ✅ Returns `{"status": "healthy", ...}`
- ✅ Shows all tables exist

---

## 🔧 If Something Doesn't Work

### Issue: Demo page shows error
**Fix:**
1. Check Vercel logs: Dashboard → Your Project → Logs
2. Verify `DATABASE_URL` is set in Vercel environment variables
3. Verify `JWT_SECRET` is set in Vercel environment variables

### Issue: Can't access demo
**Fix:**
1. Make sure you deployed (not just preview)
2. Check URL is correct: `https://your-app.vercel.app/demo`
3. Try incognito/private window

### Issue: Database errors
**Fix:**
1. Verify `DATABASE_URL` in Vercel matches your production database
2. Check database allows connections from Vercel IPs
3. Test database connection: Visit `/api/db/health`

---

## ✅ Once Everything Works

**Share this link with your friend:**
```
https://your-app.vercel.app/demo
```

**What they'll experience:**
1. Click link
2. Auto-logged in (no signup needed)
3. See sample content
4. Can explore all features
5. Token lasts 7 days

---

## 🎯 Quick Test Commands

After deployment, test these URLs:

```bash
# 1. Health check
curl https://your-app.vercel.app/api/db/health

# 2. Demo activation (should return token)
curl -X POST https://your-app.vercel.app/api/demo/activate

# 3. Homepage (should load)
curl https://your-app.vercel.app/
```

---

## 📝 Required Environment Variables

Make sure these are set in Vercel:

- ✅ `DATABASE_URL` - Your production database connection string
- ✅ `JWT_SECRET` - Secure random string (32+ chars)
- ✅ `NEXT_PUBLIC_APP_URL` - Your Vercel URL (optional but recommended)

**That's it!** The demo feature doesn't need Stripe or other services.

---

## 🚀 Ready to Share?

Once you've tested and everything works:
1. ✅ Demo link works
2. ✅ Can log in automatically
3. ✅ Sample content visible
4. ✅ All features accessible

**Then share:** `https://your-app.vercel.app/demo`

Your friend will have the same experience you just tested!

