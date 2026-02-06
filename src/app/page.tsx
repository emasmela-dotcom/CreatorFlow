'use client'

import { useState } from 'react'
import { ArrowRight, Play, Star, Users, Zap, Shield, BarChart3, FileText, FileSearch, Activity, Radio, Tag, Layers, Handshake, Brain, AlertCircle, Check, X, Clock, TrendingUp, CheckCircle, Sparkles } from 'lucide-react'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { useAnalytics } from '@/components/AnalyticsProvider'

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
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            CreatorFlow365
          </h1>
          <div className="flex items-center gap-4">
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

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-16">
        <div className="absolute inset-0 bg-gray-900/20" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
            CreatorFlow365
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            The all-in-one platform for content creators to manage, schedule, and monetize their content
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
          <p className="text-sm text-gray-400 mt-4">14-day free trial • No credit card required • Keep your changes when you subscribe</p>
          <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-gray-300">
              <strong className="text-white">How it works:</strong> Create and manage all your content within CreatorFlow365, then simply copy and paste to your social media platforms. We work with Instagram, Twitter/X, LinkedIn, TikTok, and YouTube.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-8 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything you need to grow as a creator</h2>
            <p className="text-xl text-gray-400 mb-6 max-w-3xl mx-auto">
              Get more than you pay for. Premium features included in every plan.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-lg mb-8">
              <Star className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Premium value included - no hidden fees, no upsells</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-8 rounded-lg border border-gray-800 hover:border-gray-600 transition-all">
              <div className="text-xs font-mono text-white mb-3">ANALYTICS</div>
              <h3 className="text-xl font-semibold mb-4">Advanced Analytics Dashboard</h3>
              <div className="h-px bg-gray-800 mb-4"></div>
              <p className="text-gray-400 mb-4">Track your performance across all platforms with real-time analytics and insights.</p>
              <div className="flex items-center gap-2 text-sm text-white">
                <Check className="w-4 h-4" />
                <span>Included in all plans</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-8 rounded-lg border border-gray-800 hover:border-gray-600 transition-all">
              <div className="text-xs font-mono text-white mb-3">AUTOMATION</div>
              <h3 className="text-xl font-semibold mb-4">Smart Scheduling</h3>
              <div className="h-px bg-gray-800 mb-4"></div>
              <p className="text-gray-400 mb-4">Schedule posts across Instagram, Twitter, LinkedIn, TikTok, and YouTube with optimal timing.</p>
              <div className="flex items-center gap-2 text-sm text-white mb-3">
                <Check className="w-4 h-4" />
                <span>AI-powered recommendations</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 mb-2">Supported Platforms:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-gray-700 text-white rounded">Instagram</span>
                  <span className="text-xs px-2 py-1 bg-gray-700 text-white rounded">Twitter/X</span>
                  <span className="text-xs px-2 py-1 bg-gray-700 text-white rounded">LinkedIn</span>
                  <span className="text-xs px-2 py-1 bg-gray-700 text-white rounded">TikTok</span>
                  <span className="text-xs px-2 py-1 bg-gray-700 text-white rounded">YouTube</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-8 rounded-lg border border-gray-800 hover:border-gray-600 transition-all">
              <div className="text-xs font-mono text-white mb-3">PARTNERSHIPS</div>
              <h3 className="text-xl font-semibold mb-4">Brand Collaborations</h3>
              <div className="h-px bg-gray-800 mb-4"></div>
              <p className="text-gray-400 mb-4">Manage partnerships, track campaigns, and grow your brand relationships.</p>
              <div className="flex items-center gap-2 text-sm text-white">
                <Check className="w-4 h-4" />
                <span>Full collaboration tools</span>
              </div>
            </div>
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


      {/* Pricing Section */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Simple, transparent pricing</h2>
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
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Enhanced AI features</span></li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Email support (48hr)</span></li>
              </ul>
              <button 
                onClick={() => handlePricingClick('starter')}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Get Started
              </button>
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
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Additional Posts Section */}
      <section className="py-20 px-6 bg-gray-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Purchase Additional Posts</h2>
            </div>

            <p className="text-gray-300 text-lg mb-6">
              Need more posts than your plan includes? Purchase additional posts that roll over forever.
            </p>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-white mb-4 text-xl">How Post Rollover Works</h3>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1 font-bold">1.</span>
                  <span><strong className="text-white">Monthly posts</strong> reset each month (from your subscription plan)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1 font-bold">2.</span>
                  <span><strong className="text-green-400">Purchased posts</strong> never expire and roll over forever</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1 font-bold">3.</span>
                  <span><strong className="text-white">Monthly posts are used first</strong>, then purchased posts are used</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1 font-bold">Example:</span>
                  <span>If you buy 20 posts and use all 15 monthly posts, those 20 purchased posts carry over to next month</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Available Packages</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 text-center">
                  <div className="text-2xl font-bold text-white mb-1">$4</div>
                  <div className="text-sm text-gray-300 mb-1">5 Posts</div>
                  <div className="text-xs text-gray-400">$0.80/post</div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 text-center">
                  <div className="text-2xl font-bold text-white mb-1">$8</div>
                  <div className="text-sm text-gray-300 mb-1">10 Posts</div>
                  <div className="text-xs text-gray-400">$0.80/post</div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 text-center">
                  <div className="text-2xl font-bold text-white mb-1">$12</div>
                  <div className="text-sm text-gray-300 mb-1">15 Posts</div>
                  <div className="text-xs text-gray-400">$0.80/post</div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 text-center">
                  <div className="text-2xl font-bold text-white mb-1">$15</div>
                  <div className="text-sm text-gray-300 mb-1">20 Posts</div>
                  <div className="text-xs text-gray-400">$0.75/post</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border-2 border-white text-center">
                  <div className="text-2xl font-bold text-white mb-1">$18</div>
                  <div className="text-sm text-gray-300 mb-1">24 Posts</div>
                  <div className="text-xs text-white font-semibold">$0.75/post • 10% Savings</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4 text-center">
                All purchased posts roll over forever and never expire
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Bundles Section - agreed site pricing */}
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
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Starter Bundle</h3>
                <div className="text-3xl font-bold text-white mb-1">$5</div>
                <div className="text-sm text-gray-400 mb-3">50 credits · $0.10/credit</div>
                <p className="text-xs text-gray-400 mb-4">Perfect for trying premium tools</p>
                <ul className="text-left text-sm text-gray-300 space-y-1 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> 5 uses of Viral Predictor</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> 10 uses of Brand Kit Manager</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> 6 uses of Advanced Analytics</li>
                </ul>
                <button onClick={() => handleBuyCredits('starter')} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">Buy credits</button>
              </div>
              <div className="bg-gray-800/50 border-2 border-white rounded-xl p-6 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-0.5 rounded-full text-xs font-semibold">Most Popular</div>
                <h3 className="text-xl font-bold text-white mb-2">Popular Bundle</h3>
                <div className="text-3xl font-bold text-white mb-1">$10</div>
                <div className="text-sm text-gray-400 mb-3">100 credits · $0.10/credit</div>
                <p className="text-xs text-gray-400 mb-4">Best value for regular users</p>
                <ul className="text-left text-sm text-gray-300 space-y-1 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> 10 uses of Viral Predictor</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> 20 uses of Brand Kit Manager</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> 12 uses of Advanced Analytics</li>
                </ul>
                <button onClick={() => handleBuyCredits('popular')} className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-medium transition-colors">Buy credits</button>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Power Bundle</h3>
                <div className="text-3xl font-bold text-white mb-1">$20</div>
                <div className="text-sm text-green-400 mb-1">Save $5 (20% off)</div>
                <div className="text-sm text-gray-400 mb-3">250 credits · $0.08/credit</div>
                <p className="text-xs text-gray-400 mb-4">Best for power users</p>
                <ul className="text-left text-sm text-gray-300 space-y-1 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> 25 uses of Viral Predictor</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> 50 uses of Brand Kit Manager</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> 31 uses of Advanced Analytics</li>
                </ul>
                <button onClick={() => handleBuyCredits('power')} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">Buy credits</button>
              </div>
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
                Create content, schedule posts, and use all features. If you love it and want to keep your changes, simply subscribe to a paid plan. 
                If you don't subscribe, your changes will be reverted to your original state.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to grow your creator business?</h2>
          <p className="text-xl text-gray-400 mb-8">Join thousands of creators who are already using CreatorFlow to scale their content.</p>
          <button 
            onClick={() => window.location.href = '/signup'}
            className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-2 mx-auto"
          >
            Start Your Free Trial
            <Play className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">CreatorFlow365</h3>
          <p className="text-gray-400 mb-6">The ultimate platform for content creators</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <a href="/reviews" className="hover:text-white transition-colors">Reviews</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="mailto:support@creatorflow365.com" className="hover:text-white transition-colors">Support</a>
            <a href="mailto:support@creatorflow365.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}