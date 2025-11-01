# 🌐 Point CreatorFlow.ai from Hostinger to Vercel

## Step 1: Get Vercel DNS Info

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click your CreatorFlow project**
3. **Go to Settings** (top menu)
4. **Click "Domains"** (left sidebar)
5. **Click "Add"** button
6. **Enter**: `creatorflow.ai`
7. **Click "Add"**

Vercel will show you what DNS records to add. Usually:
- **CNAME record**: Point to `cname.vercel-dns.com`
- **Or A records**: IP addresses (if CNAME not supported)

**Write down what Vercel tells you!**

---

## Step 2: Log into Hostinger

1. **Go to**: https://www.hostinger.com/
2. **Log in** to your account
3. **Go to**: hPanel (Hostinger control panel)

---

## Step 3: Find DNS Management

1. **In hPanel**, find **"Domains"** section
2. **Click on your domain**: `creatorflow.ai`
3. **Look for**: "DNS Zone Editor" or "DNS Management" or "Manage DNS"
4. **Click on it**

---

## Step 4: Update DNS Records

### Option A: Using CNAME (Easiest)

1. **Find existing records** for `creatorflow.ai` or `@`
2. **Delete or edit** the A record that points to Hostinger
3. **Add new CNAME record:**
   - **Name/Host**: `@` (or leave blank for root domain)
   - **Type**: CNAME
   - **Value/Target**: `cname.vercel-dns.com`
   - **TTL**: 3600 (or default)
4. **Save**

### Option B: Using A Records (If CNAME not supported)

Vercel will give you IP addresses. Add/update A records:
- **Name**: `@` (or blank)
- **Type**: A
- **Value**: [IP from Vercel] (usually `76.76.21.21` or similar)
- **TTL**: 3600

---

## Step 5: Wait for DNS Propagation

- **Time**: Usually 5 minutes to 1 hour (can take up to 48 hours)
- **Check status**: https://dnschecker.org
  - Enter: `creatorflow.ai`
  - Click "Search"
  - Wait for all servers to show Vercel's IP/CNAME

---

## Step 6: Verify in Vercel

1. **Go back to Vercel** → Settings → Domains
2. **Your domain** (`creatorflow.ai`) should show:
   - ✅ "Valid Configuration"
   - ✅ SSL certificate generating/active

---

## Alternative: Use Vercel Nameservers (Easier)

Instead of editing DNS records, you can point the entire domain to Vercel:

### In Hostinger:
1. **Go to**: Domain settings → Nameservers
2. **Change to Vercel nameservers:**
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
3. **Save**
4. **Wait for propagation** (5 min to 48 hours)

### In Vercel:
1. **Add domain** in Vercel (as described above)
2. **Vercel will automatically configure everything**

---

## 🆘 Troubleshooting

**Can't find DNS settings in Hostinger?**
- Look for "DNS Zone", "DNS Management", or "Advanced DNS"
- May be under "Domain Settings" or "Manage Domain"

**Vercel says domain not configured?**
- Wait longer (DNS can take time)
- Double-check records match exactly what Vercel shows
- Make sure you removed old Hostinger records

**Still seeing Hostinger page?**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Try incognito/private mode
- DNS may not have propagated to your location yet

---

## Quick Test After DNS Updates

1. **Wait 10-15 minutes** after changing DNS
2. **Visit**: https://creatorflow.ai
3. **Should see**: Your CreatorFlow site (not Hostinger page)
4. **If still Hostinger**: Wait longer or check DNS records again

---

**Need help? Tell me:**
- Can you find DNS settings in Hostinger?
- What does Vercel tell you when you add the domain?
- Are you stuck on a specific step?

