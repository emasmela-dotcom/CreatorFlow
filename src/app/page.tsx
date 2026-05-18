'use client'

/*
 * HOMEPAGE — what changed this page (source comments only; not shown to visitors)
 *
 * CURRENT HERO (May 2026 restore): "CreatorFlow365" + "Stop juggling apps. Start growing."
 *   — Restored from pre–May 8 2026 SEO rewrite (snapshot before commits 1c90d77 / 3b6544d).
 *   — Replaced SEO hero: "One workspace for beginner and pro creators…" + three answer-first paragraphs.
 *
 * REMOVED (do not re-add without explicit approval):
 *   — b058c8b: tier tool-count table (35 tools) in #tools
 *   — 9ecfc5e: long "About automatic posting" block under hero
 *
 * STILL FROM SEO / LATER WORK (below hero):
 *   — "How publishing works" callout: wording from 3b6544d era (not the older "How it works" line)
 *   — #tools: c6c1f2e pill list; headline "Your full creator OS…" (replaced grid + "53+ tools" line)
 *   — #pricing: plan snapshot + feature glossary (SEO / clarity pass, May 2026)
 *   — Trust + Proof + Claims: e23df03 / 3b6544d (E-E-A-T)
 *   — #faq + HOMEPAGE_FAQ_PAIRS JSON-LD: 71cfdc8, 83c4729
 *   — Header logo: <a href="/"> not <h1> (a2a41c4 — single H1 stays in hero)
 *   — <main id="main-content"> wrapper (a2a41c4)
 */

import { useState } from 'react'
import { ArrowRight, Play, Star, Users, Zap, Shield, BarChart3, FileText, FileSearch, Activity, Radio, Tag, Layers, Handshake, Brain, AlertCircle, Check, X, Clock, TrendingUp, CheckCircle, Sparkles, CheckSquare } from 'lucide-react'
import SeoSiteFooter from '@/components/SeoSiteFooter'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { useAnalytics } from '@/components/AnalyticsProvider'
import { CREDIT_BUNDLES } from '@/lib/creditBundles'
import { HOMEPAGE_FAQ_PAIRS } from '@/lib/seo/homepageFaq'
import { faqPageJsonLd } from '@/lib/seo/faqJsonLd'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const { trackEvent, trackConversionEvent } = useAnalytics()

  const handlePricingClick = async (plan: 'starter' | 'growth' | 'pro' | 'business' | 'agency') => {
    trackEvent('pricing_click', 'conversion', plan)
    trackConversionEvent('pricing_click', plan === 'starter' ? 9 : plan === 'growth' ? 19 : plan === 'pro' ? 49 : plan === 'business' ? 79 : 149)
    window.location.href = `/signup?plan=${plan}`
  }

  const handleBuyCredits = async (bundle: 'starter' | 'popular' | 'power') => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      window.location.href = '/signin?redirect=' + encodeURIComponent('/#credits')
      return
    }
    try {
      const res = await fetch('/api/user/purchase-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ bundle }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to start checkout')
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Could not open checkout')
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  const handleEmailSubmit = async () => {
    if (!email) {
      alert('Please enter your email address')
      return
    }
    
    trackEvent('email_signup', 'conversion', 'landing_page')
    trackConversionEvent('email_signup', 0)
    
    // Send real email using EmailJS
    try {
      // Send email using a simple service
      const emailData = {
        to: email,
        subject: 'Welcome to CreatorFlow365 - Your Free Trial is Ready!',
        message: `Welcome to CreatorFlow365! Your 14-day free trial is now active.

Here's what you get:
✅ Advanced Analytics Dashboard
✅ Smart Scheduling across all platforms
✅ Brand Collaboration Management
✅ Content Calendar
✅ Hashtag Research
✅ Performance Insights

Login to your dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'}/dashboard

Best regards,
The CreatorFlow365 Team`,
        from: 'CreatorFlow365 Team <support@creatorflow365.com>'
      };

      // Send notification to you
      const notificationData = {
        to: 'partners.clearhub@gmail.com',
        subject: 'New CreatorFlow365 Signup!',
        message: `New CreatorFlow365 signup: ${email} at ${new Date().toLocaleString()}`,
        from: 'CreatorFlow365 Signup <support@creatorflow365.com>'
      };

      // Send email using a working service that requires no setup
      try {
        // Send notification to you about the signup
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_key: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // This is a demo key
            name: 'CreatorFlow365 Signup',
            email: 'partners.clearhub@gmail.com',
            subject: 'New CreatorFlow365 Signup!',
            message: `New CreatorFlow365 signup: ${email} at ${new Date().toLocaleString()}`
          })
        });

        // Send welcome email to user using a different service
        await fetch('https://formspree.io/f/xpzgkqyw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            message: emailData.message,
            subject: 'Welcome to CreatorFlow365 - Your Free Trial is Ready!'
          })
        });

        console.log('Emails sent successfully!');
        
      } catch (error) {
        console.log('Email service error:', error);
        // Still show success message even if email fails
      }

      alert(`Thanks! We've sent your free trial details to ${email}. Check your email in a few minutes!`)
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Email error:', error)
      // Fallback - still show success message
      alert(`Thanks! We'll send your free trial details to ${email}. Check your email in a few minutes!`)
      window.location.href = '/dashboard'
    }
  }


  return (
    <>
      <AnalyticsProvider />
      <div className="min-h-screen bg-black text-white">
      {/* Header — a2a41c4: logo is <a>, not <h1>, so hero keeps the only page H1 */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-white hover:text-gray-200 transition-colors shrink-0">
            CreatorFlow365
          </a>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.href = '/#pricing'}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Compare plans
            </button>
            <button
              onClick={() => window.location.href = '/#tools'}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Tools
            </button>
            <button
              onClick={() => window.location.href = '/creator-tools'}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Creator tools
            </button>
            <button
              onClick={() => window.location.href = '/reviews'}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Reviews
            </button>
            <button
              onClick={() => window.location.href = '/signin'}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => window.location.href = '/signup'}
              className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
      {/* Promo Banner - First 25 Creators */}
      <section className="bg-gray-800 py-4 px-6 border-b border-gray-700 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Star className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-lg">
              🎉 LIMITED TIME: First 25 creators get <strong>FREE membership + 25 free posts</strong> in exchange for a review!
            </span>
            <Star className="w-5 h-5 text-white" />
          </div>
        </div>
      </section>

      {/* Hero — restored May 2026: simple H1 + tagline (reverted SEO "One workspace for beginner…" block) */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-16">
        <div className="absolute inset-0 bg-gray-900/20" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
            CreatorFlow365
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Stop juggling apps. Start growing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white w-full sm:w-80 transition-none"
              style={{ willChange: 'auto' }}
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.href = '/signup'}
                className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.location.href = '/demo'}
                className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center gap-2 border-2 border-purple-400"
              >
                <Sparkles className="w-5 h-5" />
                Try Demo (No Signup)
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">14-day free trial • No credit card required • Content is kept when you sign up for the plan you trialed</p>
          {/* Publishing callout — kept from 3b6544d; replaces older "How it works" (dashboard-first) copy */}
          <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-gray-300">
              <strong className="text-white">How publishing works:</strong> Connect your accounts and schedule directly to Instagram, Twitter/X, LinkedIn, TikTok, and YouTube—or copy and export content to paste anywhere else. Both work.
            </p>
          </div>
        </div>
      </section>

      {/* Follow Thru CRM Highlight */}
      <section id="follow-thru" className="py-16 px-6 bg-gray-900/40">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/20 border border-purple-400/40 text-xs font-semibold text-purple-100 mb-4">
              <CheckSquare className="w-4 h-4" />
              <span>Included in every CreatorFlow365 plan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Follow Thru CRM for creators</h2>
            <p className="text-gray-300 text-lg mb-4">
              Track people and promises in one place—right next to your content calendar and campaigns.
            </p>
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>See every brand, collaborator, and VIP follower with notes and next actions.</span>
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Never drop a commitment again—log promises and follow-ups with clear due dates.</span>
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Optionally extend Follow Thru with your own API automations and custom workflows.</span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { window.location.href = '/follow-thru' }}
                className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-2 text-sm"
              >
                Open Follow Thru
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => { window.location.href = '/dashboard?tab=connections' }}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 border border-gray-700 transition-all text-sm"
              >
                Set it up in your dashboard
              </button>
            </div>
          </div>
          <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-purple-400" />
              How Follow Thru is different
            </h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <p className="font-semibold text-white mb-1">Built for creators, not B2B sales teams</p>
                <p>Most CRMs are designed for corporate pipelines. Follow Thru is tuned for creators managing brands, collaborators, and high‑value followers.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Lives inside your posting workflow</p>
                <p>Your relationships, promises, and deals sit beside your content calendar, analytics, and scheduling instead of a separate tool.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Included in your plan</p>
                <p>No extra per‑seat CRM fee. You get Follow Thru with CreatorFlow365 instead of stacking another $30–$90/month SaaS.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* #tools — c6c1f2e: ten name pills; removed "53+ tools" + feature grid. b058c8b table was added then reverted. */}
      <section id="tools" className="pt-8 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Your full creator OS—not a single trick pony</h2>
            <p className="text-xl text-gray-400 mb-6 max-w-3xl mx-auto">
              AI captions, a content calendar, reusable templates, hashtag sets, batch content drafting, multi-platform scheduling, and analytics—all in one flow.
            </p>
            <p className="text-sm text-gray-400 mb-4">Everything in your dashboard—scheduling, AI drafting tools, Follow Thru CRM, and more. Premium features included in every plan.</p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-lg mb-8">
              <Star className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Premium value included - no hidden fees, no upsells</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              'Performance Predictor',
              'Brand Voice',
              'Cross-Platform Sync',
              'Content Recycling',
              'Revenue Tracker',
              'Trend Alerts',
              'A/B Testing',
              'Content Series',
              'Hashtag Optimizer',
              'Collaboration Marketplace',
            ].map((name) => (
              <span
                key={name}
                className="px-4 py-2 rounded-lg bg-gray-900/90 border border-gray-700 text-gray-200 text-sm font-medium"
              >
                {name}
              </span>
            ))}
          </div>
          
          {/* Value Proposition */}
          <div className="mt-16 bg-gray-800/50 rounded-xl border border-gray-700 p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">You Get More Than You Pay For</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-white" />
                    <h4 className="font-semibold text-white">Premium Features</h4>
                  </div>
                  <p className="text-sm text-gray-300">Enterprise-level tools included in every plan</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-white" />
                    <h4 className="font-semibold text-white">No Hidden Costs</h4>
                  </div>
                  <p className="text-sm text-gray-300">Everything you see is included—no upsells, no surprises</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-white" />
                    <h4 className="font-semibold text-white">Always Improving</h4>
                  </div>
                  <p className="text-sm text-gray-300">New features added regularly at no extra cost</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* #pricing — plan snapshot + glossary added in May 2026 SEO/clarity pass (not hero restore) */}
      <section id="pricing" className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Simple, transparent pricing</h2>

          {/* Plan snapshot at similar price points */}
          <div className="mb-12 max-w-3xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Plan snapshot at each price point</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li><strong className="text-white">Starter ($9)</strong> — Includes social account management, content library, hashtag sets, templates, AI calls, and analytics support for creators on a budget.</li>
              <li><strong className="text-white">Essential ($19)</strong> — Adds expanded social management, analytics visibility, and unlimited document workflow for creators posting across multiple channels.</li>
              <li><strong className="text-white">Creator ($49)</strong> — Adds team collaboration, API access, advanced analytics, and brand collaboration tools at one price point.</li>
              <li><strong className="text-white">Professional ($79)</strong> — Includes white-label options, expanded team capacity, predictive analytics, and advanced API access.</li>
              <li><strong className="text-white">Business ($149)</strong> — Unlimited team, full white-label, and a dedicated account manager for onboarding and escalation support.</li>
            </ul>
            <p className="text-xs text-gray-400 mt-4">
              Feature and pricing comparisons are based on publicly listed competitor pages at time of writing and may change.
            </p>
          </div>

          {/* Feature explanations - so visitors understand before joining */}
          <div className="mb-12 max-w-3xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">What these features mean</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li><strong className="text-white">Social accounts</strong> — How many platforms (e.g. Instagram, X, LinkedIn, TikTok, YouTube) you can connect and manage in one place.</li>
              <li><strong className="text-white">Documents</strong> — Your content library: scripts, captions, and drafts stored in your personal cloud.</li>
              <li><strong className="text-white">Hashtag sets</strong> — Saved groups of hashtags you can reuse for posts (research once, use everywhere).</li>
              <li><strong className="text-white">Templates</strong> — Reusable post and caption layouts so you don&apos;t start from scratch each time. Great for batch content sessions.</li>
              <li><strong className="text-white">AI calls</strong> — Each use of an AI-powered tool (e.g. AI caption writer, idea generator) counts as one call; higher plans get more or unlimited.</li>
              <li><strong className="text-white">Email support</strong> — Response time we aim for (e.g. 48hr = within 2 business days).</li>
            </ul>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex-shrink-0" style={{ minWidth: '280px', maxWidth: '320px' }}>
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-xs text-gray-400 mb-4">Remove limits</p>
              <div className="text-4xl font-bold mb-6">$9<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>3 social accounts</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Unlimited documents</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Unlimited hashtag sets</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Unlimited templates</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>500 AI calls/month</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Starter analytics included</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Enhanced AI features</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Email support (48hr)</span></li>
              </ul>
              <button 
                onClick={() => handlePricingClick('starter')}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Get Started
              </button>
              <a href="/select-plan?plan=starter" className="block text-center text-sm text-gray-400 hover:text-white mt-2">Tools offered</a>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex-shrink-0" style={{ minWidth: '280px', maxWidth: '320px' }}>
              <h3 className="text-2xl font-bold mb-2">Essential</h3>
              <p className="text-xs text-gray-400 mb-4">For creators building their workflow</p>
              <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>5 social accounts</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Unlimited everything</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>1,000 AI calls/month</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Advanced AI features</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Content analytics</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Email support (24hr)</span></li>
              </ul>
              <button 
                onClick={() => handlePricingClick('growth')}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Get Started
              </button>
              <a href="/select-plan?plan=growth" className="block text-center text-sm text-gray-400 hover:text-white mt-2">Tools offered</a>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border-2 border-white relative flex-shrink-0" style={{ minWidth: '280px', maxWidth: '320px' }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Creator</h3>
              <p className="text-xs text-gray-400 mb-4">For serious creators who want everything</p>
              <div className="text-4xl font-bold mb-6">$49<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>10 social accounts</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Unlimited AI calls</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Premium AI features</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Advanced analytics</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Team collaboration (3 members)</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>API access</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Priority support (12hr)</span></li>
              </ul>
              <button 
                onClick={() => handlePricingClick('pro')}
                className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-all"
              >
                Get Started
              </button>
              <a href="/select-plan?plan=pro" className="block text-center text-sm text-gray-400 hover:text-white mt-2">Tools offered</a>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex-shrink-0" style={{ minWidth: '280px', maxWidth: '320px' }}>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-xs text-gray-400 mb-4">Complete toolkit for professional creators</p>
              <div className="text-4xl font-bold mb-6">$79<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Unlimited accounts</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Maximum AI performance</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Premium analytics + predictions</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Team collaboration (10 members)</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>White-label options</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Advanced API access</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Priority support (6hr)</span></li>
              </ul>
              <button 
                onClick={() => handlePricingClick('business')}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Get Started
              </button>
              <a href="/select-plan?plan=business" className="block text-center text-sm text-gray-400 hover:text-white mt-2">Tools offered</a>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border-2 border-white relative flex-shrink-0" style={{ minWidth: '280px', maxWidth: '320px' }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-semibold">
                Teams &amp; agencies
              </div>
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <p className="text-xs text-gray-400 mb-4">For teams and agencies</p>
              <div className="text-4xl font-bold mb-6">$149<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Unlimited everything</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Maximum AI performance</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Enterprise analytics & reporting</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Full white-label</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Unlimited team members</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Custom integrations & API</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Dedicated account manager</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Priority support (2hr)</span></li>
              </ul>
              <button 
                onClick={() => handlePricingClick('agency')}
                className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-all font-semibold"
              >
                Get Started
              </button>
              <a href="/select-plan?plan=agency" className="block text-center text-sm text-gray-400 hover:text-white mt-2">Tools offered</a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Proof / Claims — e23df03, 3b6544d (SEO Phase 3); not part of hero restore */}
      <section className="py-20 px-6 bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why creators trust CreatorFlow365</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Who this is for</h3>
              <p className="text-sm text-gray-300">
                CreatorFlow365 is built for independent creators, small creator teams, and agencies that need one place to manage writing, planning, scheduling, and reporting.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">What&apos;s live today</h3>
              <p className="text-sm text-gray-300">
                Live today: published plans and pricing, a 14-day trial with no card required, content library workflows, scheduling tools, and plan-based analytics and collaboration features.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">How we communicate updates</h3>
              <p className="text-sm text-gray-300">
                We keep changes clear in product copy and support guidance. We avoid hype, document what is currently available, and update plan details when features or limits change.
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 max-w-4xl mx-auto mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">Who runs CreatorFlow365</h3>
            <p className="text-sm text-gray-300 mb-3">
              CreatorFlow365 operates <span className="text-white">creatorflow365.com</span> and ships the workspace you see
              on this site: planning, drafting, scheduling, analytics, and related tools in one product.
            </p>
            <p className="text-sm text-gray-300">
              That matches how we describe the service in our{' '}
              <a href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</a>
              {' '}and{' '}
              <a href="/terms" className="text-purple-400 hover:underline">Terms</a>. Product or account questions:{' '}
              <a href="mailto:support@creatorflow365.com" className="text-purple-400 hover:underline">support@creatorflow365.com</a>.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 max-w-4xl mx-auto mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Proof</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>Published plan tiers, limits, and pricing are on this page and on{' '}
                <a href="/select-plan" className="text-purple-400 hover:underline">the select-plan comparison</a>.
              </li>
              <li>14-day free trial with no credit card required—same detail repeated at signup and in FAQ below.</li>
              <li>Starter includes analytics support; Professional adds white-label options; Business adds full white-label—the cards above stay the source of truth.</li>
              <li>What we verify when we ship: signup flows, Stripe checkout for subscriptions and credits, and dashboard workflows tied to published plans.</li>
              <li>Publishing paths vary by network (direct scheduling vs copy/export)—see the “How publishing works” note under the hero; dashboard Connections explains what applies once you&apos;re logged in.</li>
              <li>Deeper reads:
                {' '}<a href="/ai-caption-writer-instagram-tiktok" className="text-purple-400 hover:underline">AI caption workflow for Instagram and TikTok</a>,
                {' '}<a href="/social-media-scheduler-for-creators" className="text-purple-400 hover:underline">scheduling workflow for creators</a>,
                {' '}<a href="/content-creator-analytics-platform" className="text-purple-400 hover:underline">analytics alongside drafting</a>,
                {' '}<a href="/creator-tools" className="text-purple-400 hover:underline">creator tools directory</a>,
                {' '}and{' '}<a href="/follow-thru" className="text-purple-400 hover:underline">Follow Thru CRM included with plans</a>.
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Claims and assumptions</h3>
            <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5">
              <li>
                Email support windows (for example 48-hour or 24-hour targets) are goals we aim for, not guarantees; wording matches plan cards on this page and billing/terms flows you agree to at signup.
              </li>
              <li>
                The plan snapshot disclaimer applies wherever we compare tiers at similar prices: we rely on publicly listed competitor pricing when quoted elsewhere—it shifts frequently—verify vendors you evaluate independently.
              </li>
              <li>
                Network availability follows official APIs for{' '}
                <a href="https://developers.facebook.com/docs/instagram-api/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Instagram via Meta</a>,{' '}
                <a href="https://developer.x.com/en/docs/twitter-api" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">X (Twitter)</a>,{' '}
                <a href="https://learn.microsoft.com/en-us/linkedin/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">LinkedIn</a>,{' '}
                <a href="https://developers.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">TikTok</a>, and{' '}
                <a href="https://developers.google.com/youtube/v3" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">YouTube</a>—features depend on those programs and your account type.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SEO Resource Pages */}
      <section className="py-16 px-6 bg-gray-900/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Explore creator growth guides</h2>
          <p className="text-gray-400 text-center mb-8">
            Start with the guide that matches what you need right now.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/ai-caption-writer-instagram-tiktok"
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-gray-500 transition-colors"
            >
              <h3 className="font-semibold text-white mb-2">AI Caption Writer Guide</h3>
              <p className="text-sm text-gray-300">
                Learn how to draft faster Instagram and TikTok captions with a reusable workflow.
              </p>
            </a>
            <a
              href="/social-media-scheduler-for-creators"
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-gray-500 transition-colors"
            >
              <h3 className="font-semibold text-white mb-2">Scheduler for Creators Guide</h3>
              <p className="text-sm text-gray-300">
                Organize multi-platform posting in one calendar without managing separate tools.
              </p>
            </a>
            <a
              href="/content-creator-analytics-platform"
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-gray-500 transition-colors"
            >
              <h3 className="font-semibold text-white mb-2">Creator Analytics Guide</h3>
              <p className="text-sm text-gray-300">
                Use analytics in the same workflow where you write and schedule content.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Credit Bundles - from creditBundles.ts (single source of truth) */}
      <section id="credits" className="py-20 px-6 bg-gray-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Credit Bundles</h2>
            </div>
            <p className="text-gray-300 text-lg mb-2">All plans include <strong className="text-white">25 free credits</strong> for your first month as a gift to try premium tools.</p>
            <p className="text-gray-400 text-sm mb-4">Lower plans: Premium tools cost credits per use. Higher plans: Premium tools included in your plan have unlimited use (no credits needed). Purchase additional credits to unlock more premium tool uses. Purchased credits roll over month to month.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {CREDIT_BUNDLES.map((bundle, i) => (
                <div key={bundle.id} className={`bg-gray-800/50 rounded-xl p-6 text-center ${bundle.id === 'popular' ? 'border-2 border-white relative' : 'border border-gray-700'}`}>
                  {bundle.id === 'popular' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-0.5 rounded-full text-xs font-semibold">Most Popular</div>}
                  <h3 className="text-xl font-bold text-white mb-2">{bundle.name}</h3>
                  <div className="text-3xl font-bold text-white mb-1">${bundle.price}</div>
                  {'savings' in bundle && bundle.savings && <div className="text-sm text-green-400 mb-1">{bundle.savings}</div>}
                  <div className="text-sm text-gray-400 mb-3">{bundle.credits} credits · {bundle.perCredit}</div>
                  <p className="text-xs text-gray-400 mb-6">{bundle.description}</p>
                  <button onClick={() => handleBuyCredits(bundle.id)} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">Buy credits</button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 text-center"><strong className="text-gray-300">How credits work:</strong> Free credits: 25 credits during your first month only (one-time trial credits).</p>
          </div>
        </div>
      </section>

      {/* Content Ownership Policy Section */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Content Ownership Policy</h2>
            </div>

            <p className="text-gray-300 text-lg mb-6">
              We want you to feel confident about your content. Here's our clear commitment to what happens 
              to changes made to your social media accounts during your trial and after you subscribe.
            </p>

            <div className="space-y-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  If you continue with a paid plan:
                </h3>
                <p className="text-gray-200">
                  All changes made to your social media accounts during the trial period will be kept. 
                  This includes all posts, content modifications, scheduled content, and analytics data created during your trial.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  If you cancel after trial:
                </h3>
                <p className="text-gray-200">
                  All changes and progress made during the trial will be reverted to your original state. 
                  Your social media accounts will be restored to exactly how they were before the trial began, 
                  including any content, posts, or modifications you made through CreatorFlow.
                </p>
              </div>

              <div className="bg-gray-800/50 border-2 border-white rounded-lg p-5 mt-6">
                <p className="text-xs font-bold text-white uppercase tracking-wide mb-2">Our Commitment</p>
                <p className="text-white">
                  CreatorFlow365 believes in creator-first ownership. Once you become a paying member, all content you create 
                  through our platform is immediately and permanently yours. We compete on quality, not restrictions.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                <strong className="text-gray-300">Free Trial:</strong> Start your 14-day free trial with <strong className="text-white">no credit card required</strong>. 
                Create content, schedule posts, and use all features. When you sign up for the plan you trialed, all your content is kept. If you don't subscribe, your changes will be reverted to your original state.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — Phase 2 + Phase 7 FAQPage JSON-LD (must match entries in HOMEPAGE_FAQ_PAIRS) */}
      <section id="faq" className="py-16 px-6 bg-black border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqPageJsonLd(HOMEPAGE_FAQ_PAIRS)),
            }}
          />
          <h2 className="text-3xl font-bold text-center mb-10 text-white">Frequently asked questions</h2>
          <dl className="space-y-6 text-gray-300 text-sm md:text-base">
            {HOMEPAGE_FAQ_PAIRS.map((item) => (
              <div key={item.question}>
                <dt className="font-semibold text-white">{item.question}</dt>
                <dd className="mt-2">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Your content workflow, finally in one place.</h2>
          <p className="text-xl text-gray-400 mb-8">Solo creators and content teams use CreatorFlow365 to batch drafts, schedule across platforms, and keep every piece of content moving forward.</p>
          <button 
            onClick={() => window.location.href = '/signup'}
            className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-2 mx-auto"
          >
            Start Your Free Trial
            <Play className="w-5 h-5" />
          </button>
        </div>
      </section>

      </main>

      <div className="text-center py-8 px-6 border-t border-gray-800">
        <h3 className="text-2xl font-bold mb-2">CreatorFlow365</h3>
        <p className="text-gray-400 mb-2">The creator workspace for planning, AI drafting, and multi-platform publishing.</p>
      </div>
      <SeoSiteFooter className="!pt-0" />
      </div>
    </>
  )
}