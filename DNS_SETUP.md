# DNS Configuration Guide - creatorflow.ai

## Quick DNS Setup for Vercel

### Option 1: CNAME Record (Recommended - Easiest)

1. **Go to your domain registrar** (GoDaddy, Namecheap, Google Domains, etc.)
2. **Find DNS Management** section
3. **Add CNAME Record:**
   - **Type**: CNAME
   - **Name/Host**: `@` (or leave blank for root domain)
   - **Value/Points to**: `cname.vercel-dns.com`
   - **TTL**: 3600 (or default)
4. **Save changes**

### Option 2: A Record (If CNAME not supported)

1. **In Vercel Dashboard:**
   - Go to Settings → Domains
   - Add domain: `creatorflow.ai`
   - Vercel will show you IP addresses

2. **In Your DNS Provider:**
   - **Type**: A
   - **Name**: `@` (or leave blank)
   - **Value**: IP address from Vercel (usually `76.76.21.21`)
   - **TTL**: 3600

### Option 3: Use Vercel's Nameservers (Best for subdomains)

If you want full control, point your domain to Vercel's nameservers:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

---

## Vercel Domain Configuration

1. **Go to Vercel Dashboard** → Your Project
2. **Settings** → **Domains**
3. **Add Domain**: Type `creatorflow.ai`
4. **Follow Vercel's instructions** to verify ownership
5. **SSL Certificate** will be automatically generated (may take a few minutes)

---

## DNS Propagation

- **Time**: Usually 5 minutes to 1 hour, can take up to 48 hours
- **Check Status**: Use https://dnschecker.org/ or `nslookup creatorflow.ai`
- **Wait for**: All servers worldwide to update

---

## Verify DNS is Working

1. **Check DNS:**
   ```bash
   nslookup creatorflow.ai
   ```

2. **Test HTTPS:**
   ```bash
   curl -I https://creatorflow.ai
   ```

3. **Check in Browser:**
   - Visit https://creatorflow.ai
   - Should see your site (may take a few minutes after DNS propagates)

---

## Common DNS Providers Instructions

### GoDaddy
1. Go to DNS Management
2. Add → CNAME
3. Host: `@`
4. Points to: `cname.vercel-dns.com`
5. TTL: 1 Hour

### Namecheap
1. Go to Domain List → Manage → Advanced DNS
2. Add New Record → CNAME Record
3. Host: `@`
4. Value: `cname.vercel-dns.com`
5. TTL: Automatic

### Google Domains
1. Go to DNS → Custom Records
2. Add → CNAME
3. Name: `@`
4. Data: `cname.vercel-dns.com`

### Cloudflare
1. Go to DNS → Records
2. Add Record
3. Type: CNAME
4. Name: `@`
5. Target: `cname.vercel-dns.com`
6. Proxy: DNS only (gray cloud) or Proxied (orange cloud)

---

## Troubleshooting

### Domain not pointing to Vercel
- **Wait longer**: DNS can take up to 48 hours
- **Check TTL**: Lower TTL = faster updates
- **Clear DNS cache**: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### SSL Certificate not generating
- **Wait**: Can take 5-10 minutes after DNS is correct
- **Check**: Domain must resolve correctly first
- **Verify**: In Vercel Dashboard → Domains, check certificate status

### Still using old site
- **Clear browser cache**
- **Try incognito/private mode**
- **Check**: DNS may not have propagated to your location yet

---

**After DNS is set up and SSL certificate is issued, your site will be live at https://creatorflow.ai! 🎉**

