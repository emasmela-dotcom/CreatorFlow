# Environment Variables Reference - CreatorFlow.ai

## Required Variables for Production

Copy these to Vercel Dashboard → Settings → Environment Variables

### Application URL
```env
NEXT_PUBLIC_APP_URL=https://creatorflow.ai
```

### Database (Turso)
```env
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

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

