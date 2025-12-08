# CreatorFlow.ai

A comprehensive SaaS platform for content creators to manage, schedule, and monetize their content across multiple social media platforms.

## Features

- 🎯 **Multi-Platform Management** - Manage Instagram, Twitter, LinkedIn, TikTok, and YouTube
- 📊 **Analytics Dashboard** - Track performance across all platforms
- 📅 **Smart Scheduling** - Schedule posts with optimal timing
- 💼 **Brand Collaborations** - Manage partnerships and campaigns
- 💳 **Flexible Pricing** - 5 subscription tiers (Starter, Growth, Pro, Business, Agency)
- 🆓 **Free Trial** - 15-day trial with credit card required
- 💾 **Safe Trial System** - Automatic backup before trial, restore if you don't continue

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Turso (LibSQL/SQLite) - Free, serverless, never pauses
- **Payments**: Stripe (subscriptions with trial periods)
- **Authentication**: JWT with bcrypt password hashing
- **Deployment**: Vercel

## 🚀 Quick Start - Development URL

**⚠️ IMPORTANT:** Always use `http://127.0.0.1:3000` (NOT `localhost:3000`)

All pages:
- Homepage: `http://127.0.0.1:3000/`
- Signup: `http://127.0.0.1:3000/signup`
- Signin: `http://127.0.0.1:3000/signin`
- Create Post: `http://127.0.0.1:3000/create/`
- Dashboard: `http://127.0.0.1:3000/dashboard`

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Turso account (free tier available)
- Stripe account (for payments)

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd CreatorFlow
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file:
```env
# Database
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-auth-token

# Stripe (use test keys for development)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_BUSINESS=price_...
STRIPE_PRICE_AGENCY=price_...

# JWT
JWT_SECRET=your-random-secret-key

# App URL (use 127.0.0.1 instead of localhost)
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

4. Initialize database
The database schema will be created automatically on first API call, or run:
```bash
npm run dev
# Then visit http://localhost:3000/api/test to initialize
```

5. Run development server
```bash
npm run dev
```

Visit `http://127.0.0.1:3000` to see the app.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── backup/        # Backup creation endpoint
│   │   ├── restore/       # Restore endpoint
│   │   ├── stripe/        # Stripe checkout and webhooks
│   │   ├── subscription/  # Subscription management
│   │   └── user/          # User management
│   ├── dashboard/         # Dashboard pages
│   ├── signup/            # Signup flow
│   └── page.tsx           # Homepage
├── components/
│   ├── PlanSelection.tsx      # Plan selection component
│   ├── TrialTerms.tsx         # Trial terms display
│   ├── TrialEndNotification.tsx # Trial ending modal
│   └── ...
└── lib/
    ├── db.ts              # Database client and schema
    └── analytics.ts       # Analytics utilities
```

## Key Features Explained

### Trial System

The trial system works as follows:

1. **Trial Start**: User selects plan → Creates account → Enters payment info via Stripe
   - Backup is automatically created BEFORE trial starts
   - 15-day trial period begins
   - No charge to credit card during trial

2. **During Trial**: User has full access to selected plan features

3. **Trial End**:
   - **Continue**: Subscription automatically activates, user keeps all changes
   - **Cancel**: Changes are reverted, original backup is restored

### Backup & Restore System

- **Backup**: Created automatically when trial starts
  - Captures: content posts, analytics data, user settings
  - Stored in `project_backups` table
  
- **Restore**: Triggered when user cancels or doesn't continue
  - Deletes all data created during trial
  - Restores original project state from backup
  - Marks backup as restored

### Subscription Plans

- **Starter** ($19/mo): 3 accounts, 30 posts/month, basic features
- **Growth** ($29/mo): 5 accounts, 100 posts/month, enhanced features
- **Pro** ($39/mo): 10 accounts, unlimited posts, advanced features
- **Business** ($49/mo): 15 accounts, team collaboration, premium features
- **Agency** ($99/mo): Unlimited accounts, white-label, API access

## API Endpoints

### Authentication
- `POST /api/auth` - Signup or login
- `GET /api/auth` - Get current user

### Backup & Restore
- `POST /api/backup` - Create project backup
- `GET /api/backup?userId=...` - Get backup status
- `POST /api/restore` - Restore project to original state

### Payments
- `POST /api/stripe/trial` - Create Stripe checkout session with trial
- `POST /api/stripe/webhook` - Stripe webhook handler

### Subscriptions
- `GET /api/subscription/manage` - Get subscription status
- `DELETE /api/subscription/manage` - Cancel subscription

## Testing

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for comprehensive testing guide.

Quick test:
```bash
# Test database connection
curl http://localhost:3000/api/test
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Connect custom domain (creatorflow.ai)
5. Deploy

See [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) for detailed launch steps.

## Setup Guides

- [Database Setup](./DATABASE_SETUP.md) - Turso database configuration
- [Stripe Setup](./STRIPE_SETUP.md) - Stripe products, prices, and webhooks

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `TURSO_DATABASE_URL` | Turso database connection URL | Yes |
| `TURSO_AUTH_TOKEN` | Turso authentication token | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_live_ or sk_test_) | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes |
| `STRIPE_PRICE_*` | Stripe price IDs for each plan | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NEXT_PUBLIC_APP_URL` | Public app URL | Yes |

## Troubleshooting

### Database Connection Issues
- Verify Turso credentials are correct
- Check if database URL is accessible
- Verify network connectivity

### Stripe Webhook Issues
- Verify webhook secret matches
- Check webhook endpoint URL in Stripe dashboard
- Test webhook with Stripe CLI

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration
- Verify token format

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Your License Here]

## Support

For issues or questions:
- Create an issue in the repository
- Contact: [Your Support Email]

## Roadmap

- [ ] Additional social media platforms
- [ ] Advanced analytics features
- [ ] AI-powered content suggestions
- [ ] Team collaboration improvements
- [ ] Mobile app
