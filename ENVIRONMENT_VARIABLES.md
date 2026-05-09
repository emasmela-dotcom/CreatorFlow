# Environment Variables Reference — CreatorFlow365

## Required Variables for Production

Copy these to Vercel Dashboard → Settings → Environment Variables (**Production**).

### Application URL
```env
NEXT_PUBLIC_APP_URL=https://www.creatorflow365.com
NEXT_PUBLIC_BASE_URL=https://www.creatorflow365.com
```
(`NEXT_PUBLIC_BASE_URL` is used for some OAuth/callback URLs; match your canonical domain.)

### Database (Neon PostgreSQL)
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```
**OR** (alternative name)
```env
NEON_DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```
**📝 Note**: Get your connection string from the Neon console → Click "Connect" on your database

### Authentication
```env
JWT_SECRET=your-secure-jwt-secret-key-change-in-production
```
**⚠️ Important**: Generate a strong random string (minimum 32 characters)

### Stripe (Live Mode)
```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_STARTER=price_starter_live_id
STRIPE_PRICE_GROWTH=price_growth_live_id
STRIPE_PRICE_PRO=price_pro_live_id
STRIPE_PRICE_BUSINESS=price_business_live_id
STRIPE_PRICE_AGENCY=price_agency_live_id
```

## Optional Variables

### Email Services
```env
WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
FORMSPREE_ENDPOINT=https://formspree.io/f/your-endpoint
```

### Analytics
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Meta (Facebook) Pixel (optional)
```env
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
```
Numeric Pixel ID from Meta Events Manager. If unset or invalid, no Pixel scripts load.

### Search Console (optional HTML tag verification)
```env
GOOGLE_SITE_VERIFICATION=your-google-verification-string
```
Set only if you use the meta-tag verification method (`layout.tsx` reads this).

## How to Set in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add each variable
5. **IMPORTANT**: Select "Production" environment
6. Save and redeploy

## Generating Secure JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Testing Variables

After setting variables, test them:
1. Redeploy your project
2. Check Vercel logs for any errors
3. Test signup flow end-to-end

