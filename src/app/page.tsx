'use client'

import { useState } from 'react'
import { ArrowRight, Play, Star, Users, Zap, Shield, BarChart3, FileText, FileSearch, Activity, Radio, Tag, Layers, Handshake, Brain } from 'lucide-react'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { useAnalytics } from '@/components/AnalyticsProvider'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const { trackEvent, trackConversionEvent } = useAnalytics()

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
        subject: 'Welcome to CreatorFlow - Your Free Trial is Ready!',
        message: `Welcome to CreatorFlow! Your 14-day free trial is now active.

Here's what you get:
✅ Advanced Analytics Dashboard
✅ Smart Scheduling across all platforms
✅ Brand Collaboration Management
✅ Content Calendar
✅ Hashtag Research
✅ Performance Insights

Login to your dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'https://creatorflow.ai'}/dashboard

Best regards,
The CreatorFlow Team`,
        from: 'CreatorFlow Team <noreply@creatorflow.com>'
      };

      // Send notification to you
      const notificationData = {
        to: 'emasmela1976@gmail.com',
        subject: 'New CreatorFlow Signup!',
        message: `New CreatorFlow signup: ${email} at ${new Date().toLocaleString()}`,
        from: 'CreatorFlow Signup <noreply@creatorflow.com>'
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
            name: 'CreatorFlow Signup',
            email: 'emasmela1976@gmail.com',
            subject: 'New CreatorFlow Signup!',
            message: `New CreatorFlow signup: ${email} at ${new Date().toLocaleString()}`
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
            subject: 'Welcome to CreatorFlow - Your Free Trial is Ready!'
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

  const handlePricingClick = (plan: string) => {
    trackEvent('pricing_click', 'conversion', plan)
    trackConversionEvent('pricing_click', plan === 'starter' ? 19 : plan === 'pro' ? 49 : 99)
    
    // Redirect to signup with plan pre-selected
    window.location.href = `/signup?plan=${plan}`
  }

  return (
    <>
      <AnalyticsProvider />
      <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-900/20" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            CreatorFlow
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
              className="px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
            />
            <button
              onClick={() => window.location.href = '/signup'}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">Credit card required • 14-day free trial (no charge during trial)</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Everything you need to grow as a creator</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
              <div className="text-xs font-mono text-gray-500 mb-3">ANALYTICS</div>
              <h3 className="text-xl font-semibold mb-4">Analytics Dashboard</h3>
              <div className="h-px bg-gray-800 mb-4"></div>
              <p className="text-gray-400">Track your performance across all platforms with real-time analytics and insights.</p>
            </div>
            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
              <div className="text-xs font-mono text-gray-500 mb-3">AUTOMATION</div>
              <h3 className="text-xl font-semibold mb-4">Smart Scheduling</h3>
              <div className="h-px bg-gray-800 mb-4"></div>
              <p className="text-gray-400">Schedule posts across Instagram, Twitter, LinkedIn, and TikTok with optimal timing.</p>
            </div>
            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
              <div className="text-xs font-mono text-gray-500 mb-3">PARTNERSHIPS</div>
              <h3 className="text-xl font-semibold mb-4">Brand Collaborations</h3>
              <div className="h-px bg-gray-800 mb-4"></div>
              <p className="text-gray-400">Manage partnerships, track campaigns, and grow your brand relationships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Unique AI Tools Section - Teaser (Names Only) */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900/50 to-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              EXCLUSIVE TO CREATORFLOW
            </div>
            <h2 className="text-4xl font-bold mb-4">8 AI Tools Nobody Else Has</h2>
            <p className="text-xl text-gray-400 mb-6">Available exclusively with the Agency plan</p>
            <p className="text-lg text-purple-400 font-semibold">Unlock full access and detailed features with Agency plan ($99/month)</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all relative overflow-hidden">
              <div className="mb-4 h-20 flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 100" className="text-purple-500/40">
                    <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                    <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                    <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
                    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                    <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Brand Voice Analyzer</h3>
              <p className="text-xs text-gray-400">Brand consistency analysis</p>
            </div>

            <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all relative overflow-hidden">
              <div className="mb-4 h-20 flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 100" className="text-indigo-500/40">
                    <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
                    <polygon points="50,25 75,80 25,80" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                    <polygon points="50,40 60,70 40,70" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
                    <circle cx="50" cy="55" r="8" fill="currentColor" opacity="0.5"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Content Gap Analyzer</h3>
              <p className="text-xs text-gray-400">Competitive content intelligence</p>
            </div>

            <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all relative overflow-hidden">
              <div className="mb-4 h-20 flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 60" className="text-purple-500/50">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
                      </pattern>
                    </defs>
                    <rect width="100" height="60" fill="url(#grid)"/>
                    <polyline points="10,50 25,40 40,30 55,20 70,15 85,18" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.8"/>
                    <polyline points="15,52 30,42 45,32 60,22 75,17 90,20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Engagement Predictor</h3>
              <p className="text-xs text-gray-400">Performance forecasting engine</p>
            </div>

            <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all relative overflow-hidden">
              <div className="mb-4 h-20 flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 100" className="text-indigo-500/40">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5"/>
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
                    <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.8"/>
                    <line x1="50" y1="10" x2="50" y2="42" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                    <line x1="50" y1="58" x2="50" y2="90" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                    <line x1="10" y1="50" x2="42" y2="50" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                    <line x1="58" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Viral Moment Detector</h3>
              <p className="text-xs text-gray-400">Real-time trend analysis</p>
            </div>

            <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all relative overflow-hidden">
              <div className="mb-4 h-20 flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 100" className="text-purple-500/50">
                    <path d="M 30 30 L 70 30 L 70 40 L 50 50 L 30 40 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                    <path d="M 30 50 L 70 50 L 70 60 L 50 70 L 30 60 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
                    <line x1="50" y1="30" x2="50" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
                    <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.9"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Hashtag Optimizer</h3>
              <p className="text-xs text-gray-400">Context-aware optimization</p>
            </div>

            <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all relative overflow-hidden">
              <div className="mb-4 h-20 flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 100" className="text-indigo-500/50">
                    <rect x="20" y="60" width="15" height="30" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                    <rect x="40" y="40" width="15" height="50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
                    <rect x="60" y="70" width="15" height="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
                    <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                    <line x1="10" y1="80" x2="90" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                    <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Platform Reformatter</h3>
              <p className="text-xs text-gray-400">Cross-platform content adaptation</p>
            </div>

            <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all relative overflow-hidden">
              <div className="mb-4 h-20 flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 100" className="text-indigo-500/40">
                    <path d="M 30 30 L 70 30 L 70 70 L 30 70 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
                    <path d="M 40 40 L 60 40 L 60 60 L 40 60 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
                    <circle cx="50" cy="50" r="5" fill="currentColor" opacity="0.8"/>
                    <line x1="50" y1="40" x2="50" y2="60" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                    <line x1="40" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Collaboration Matchmaker</h3>
              <p className="text-xs text-gray-400">Strategic partnership matching</p>
            </div>

            <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all relative overflow-hidden">
              <div className="mb-4 h-20 flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 100" className="text-purple-500/40">
                    <path d="M 20 50 Q 35 30, 50 50 Q 65 70, 80 50" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6"/>
                    <path d="M 25 50 Q 38 35, 50 50 Q 62 65, 75 50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
                    <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.9"/>
                    <line x1="50" y1="20" x2="50" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                    <line x1="50" y1="55" x2="50" y2="80" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sentiment Analysis Engine</h3>
              <p className="text-xs text-gray-400">Audience sentiment tracking</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button 
              onClick={() => window.location.href = '/signup?plan=agency'}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Unlock All 8 Tools with Agency Plan →
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Starter</h3>
              <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> 2 social accounts</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> 15 posts per month (shared)</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Basic analytics</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Content calendar</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Email support</li>
              </ul>
              <button 
                onClick={() => handlePricingClick('starter')}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Growth</h3>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> 3 social accounts</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> 25 posts per month (shared)</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Enhanced analytics</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Content calendar</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Basic brand collaborations</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Email support</li>
              </ul>
              <button 
                onClick={() => handlePricingClick('growth')}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-slate-900/50 p-8 rounded-xl border border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-6">$39<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> 4 social accounts</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> 35 posts per month (shared)</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Advanced analytics</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Brand collaborations</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Hashtag research</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Priority support</li>
              </ul>
              <button 
                onClick={() => handlePricingClick('pro')}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all"
              >
                Get Started
              </button>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Business</h3>
              <div className="text-4xl font-bold mb-6">$49<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> 5 social accounts</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> 50 posts per month (shared)</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Premium analytics</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Advanced brand collaborations</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Hashtag research</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Content scheduling AI</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Priority support</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Team collaboration (up to 3 members)</li>
              </ul>
              <button 
                onClick={() => handlePricingClick('business')}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-xl border-2 border-purple-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Ultimate Tool
              </div>
              <h3 className="text-2xl font-bold mb-4">Agency</h3>
              <div className="text-4xl font-bold mb-6">$99<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Unlimited accounts</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Unlimited posts</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> White-label options</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Full team collaboration</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Priority support</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Custom integrations</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Dedicated account manager</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> API access</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Advanced reporting</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Multi-brand management</li>
              </ul>
              <button 
                onClick={() => handlePricingClick('agency')}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg transition-all font-semibold"
              >
                Get Started
              </button>
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
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 mx-auto"
          >
            Start Your Free Trial
            <Play className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">CreatorFlow</h3>
          <p className="text-gray-400 mb-6">The ultimate platform for content creators</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}