# 🎯 Guide: Buying & Connecting creatorflow.ai Domain

**Date:** December 8, 2024

---

## 💰 Where to Buy .ai Domains

### **Recommended Registrars:**

1. **Namecheap** (Popular, Good Prices)
   - URL: https://www.namecheap.com/domains/registration/results/?domain=creatorflow.ai
   - Price: ~$70-90/year
   - Easy DNS management
   - Good customer support

2. **GoDaddy** (Most Popular)
   - URL: https://www.godaddy.com/domains/search?domainToCheck=creatorflow.ai
   - Price: ~$80-100/year
   - Very user-friendly
   - Good for beginners

3. **Google Domains** (Now Squarespace Domains)
   - URL: https://domains.squarespace.com/
   - Price: ~$70-85/year
   - Simple interface
   - Good integration options

4. **Porkbun** (Best Prices)
   - URL: https://porkbun.com/checkout/search?q=creatorflow.ai
   - Price: ~$50-70/year
   - Often cheapest option
   - Good for budget-conscious

5. **Name.com** (Good Balance)
   - URL: https://www.name.com/domain/search/creatorflow.ai
   - Price: ~$70-90/year
   - Reliable service

---

## ⚠️ Important Notes About .ai Domains

### **Pricing:**
- **.ai domains are more expensive** than .com domains
- Typical cost: **$50-100/year** (vs $10-15/year for .com)
- First year might have discounts, renewal is usually full price

### **Availability:**
- Check if `creatorflow.ai` is available first
- If taken, consider alternatives:
  - `creatorflowai.com`
  - `getcreatorflow.ai`
  - `creatorflow.app`
  - `creatorflow.io`

### **Registration Requirements:**
- Most registrars require:
  - Valid email address
  - Payment method
  - Contact information
- No special requirements for .ai domains

---

## 🛒 Step-by-Step: Buying the Domain

### **Step 1: Check Availability**
1. Go to any registrar (Namecheap recommended)
2. Search for: `creatorflow.ai`
3. Check if it's available

### **Step 2: Purchase**
1. Add to cart
2. Choose registration period (1 year minimum)
3. **Optional:** Add privacy protection (recommended, ~$10/year)
4. Complete checkout

### **Step 3: Verify Purchase**
1. Check email for confirmation
2. Log into registrar account
3. Verify domain appears in your account

---

## 🔗 Step-by-Step: Connecting to Vercel

### **Step 1: Add Domain in Vercel**

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard

2. **Click on your CreatorFlow project**

3. **Go to Settings** → **Domains** (left sidebar)

4. **Click "Add Domain"** button

5. **Enter:** `creatorflow.ai`

6. **Click "Add"**

7. **Vercel will show you DNS instructions:**
   - Usually: CNAME record pointing to `cname.vercel-dns.com`
   - Or: A records with IP addresses

**Write down what Vercel tells you!**

---

### **Step 2: Configure DNS at Your Registrar**

#### **If Using CNAME (Recommended):**

1. **Log into your domain registrar** (Namecheap, GoDaddy, etc.)

2. **Find DNS Management:**
   - Namecheap: Domain List → Manage → Advanced DNS
   - GoDaddy: My Products → DNS
   - Google: DNS Settings

3. **Add CNAME Record:**
   - **Type:** CNAME
   - **Host/Name:** `@` (or leave blank for root domain)
   - **Value/Target:** `cname.vercel-dns.com` (or what Vercel shows)
   - **TTL:** 3600 (or default)

4. **Save changes**

#### **If Using A Records:**

1. **Vercel will give you IP addresses** (usually `76.76.21.21`)

2. **Add A Record:**
   - **Type:** A
   - **Host/Name:** `@` (or blank)
   - **Value:** [IP from Vercel]
   - **TTL:** 3600

3. **Save changes**

---

### **Step 3: Wait for DNS Propagation**

- **Time:** Usually 5-60 minutes (can take up to 48 hours)
- **Check Status:** https://dnschecker.org
  - Enter: `creatorflow.ai`
  - Click "Search"
  - Wait for all servers worldwide to show Vercel's IP

---

### **Step 4: Verify in Vercel**

1. **Go back to Vercel** → Settings → Domains

2. **Your domain should show:**
   - ✅ "Valid Configuration"
   - ✅ SSL certificate generating/active (automatic)

3. **SSL Certificate:**
   - Vercel automatically generates SSL
   - Usually takes 5-10 minutes after DNS propagates
   - You'll see "Valid" status when ready

---

### **Step 5: Update Environment Variables**

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Update or Add:**
   ```
   NEXT_PUBLIC_APP_URL=https://creatorflow.ai
   ```

3. **Redeploy:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## ✅ After Setup

### **Your Site Will Be Live At:**
- ✅ **https://creatorflow.ai** (main domain)
- ✅ **https://www.creatorflow.ai** (www subdomain - automatic)

### **Update These URLs:**
- Stripe webhook: `https://creatorflow.ai/api/stripe/webhook`
- OAuth callbacks: `https://creatorflow.ai/api/auth/callback/...`
- All internal links will use the new domain

---

## 💡 Tips

### **Save Money:**
- Look for first-year discounts
- Some registrars offer multi-year discounts
- Compare prices across registrars

### **Privacy:**
- Consider adding "Whois Privacy" protection
- Prevents your contact info from being public
- Usually ~$10/year extra

### **DNS Management:**
- Keep DNS records simple
- Use CNAME if possible (easier to manage)
- Don't delete existing records unless you know what they do

### **Testing:**
- Test locally first: `http://localhost:3000`
- Use production URL: `https://creatorflow-iota.vercel.app`
- Then switch to custom domain: `https://creatorflow.ai`

---

## 🚨 Common Issues

### **Domain Not Resolving:**
- Wait longer (DNS can take up to 48 hours)
- Check DNS records are correct
- Verify in Vercel that domain is added

### **SSL Certificate Not Working:**
- Wait 10-15 minutes after DNS propagates
- Check Vercel shows "Valid Configuration"
- Clear browser cache

### **Can't Add Domain in Vercel:**
- Make sure you own the domain
- Check domain is not already added to another Vercel project
- Verify DNS records are correct

---

## 📋 Quick Checklist

- [ ] Buy `creatorflow.ai` domain
- [ ] Add domain in Vercel Dashboard
- [ ] Configure DNS records at registrar
- [ ] Wait for DNS propagation (check dnschecker.org)
- [ ] Verify SSL certificate in Vercel
- [ ] Update `NEXT_PUBLIC_APP_URL` environment variable
- [ ] Redeploy application
- [ ] Test: Visit https://creatorflow.ai
- [ ] Update Stripe webhook URL
- [ ] Update any hardcoded URLs in code

---

## 🎉 Summary

**Buying a .ai domain:**
1. Choose registrar (Namecheap recommended)
2. Search and purchase `creatorflow.ai`
3. Add to Vercel → Settings → Domains
4. Configure DNS at registrar
5. Wait for propagation
6. Update environment variables
7. Done! 🎉

**Cost:** ~$50-100/year  
**Time:** 1-2 hours (mostly waiting for DNS)

**Your site will be live at: https://creatorflow.ai** 🚀

