'use client'

import { useState } from 'react'
import { ArrowRight, Play, Star, Users, Zap, Shield, BarChart3 } from 'lucide-react'
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
    
    // Simulate email signup
    try {
      // In a real app, this would send to your email service
      console.log('Email signup:', email)
      alert(`Thanks! We'll send your free trial details to ${email}`)
      
      // Redirect to dashboard or pricing
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Signup error:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  const handlePricingClick = (plan: string) => {
    trackEvent('pricing_click', 'conversion', plan)
    trackConversionEvent('pricing_click', plan === 'starter' ? 19 : plan === 'pro' ? 49 : 99)
    
    // Redirect to pricing or signup
    alert(`Redirecting to ${plan} plan signup...`)
    window.location.href = '/dashboard'
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
              onClick={handleEmailSubmit}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Everything you need to grow as a creator</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <BarChart3 className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Analytics Dashboard</h3>
              <p className="text-gray-400">Track your performance across all platforms with real-time analytics and insights.</p>
            </div>
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <Zap className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Smart Scheduling</h3>
              <p className="text-gray-400">Schedule posts across Instagram, Twitter, LinkedIn, and TikTok with optimal timing.</p>
            </div>
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <Users className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Brand Collaborations</h3>
              <p className="text-gray-400">Manage partnerships, track campaigns, and grow your brand relationships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Starter</h3>
              <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> 3 social accounts</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> 30 posts per month</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Basic analytics</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Content calendar</li>
              </ul>
              <button 
                onClick={() => handlePricingClick('starter')}
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
              <div className="text-4xl font-bold mb-6">$49<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> 10 social accounts</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Unlimited posts</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Advanced analytics</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Brand collaborations</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Hashtag research</li>
              </ul>
              <button 
                onClick={() => handlePricingClick('pro')}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all"
              >
                Get Started
              </button>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Agency</h3>
              <div className="text-4xl font-bold mb-6">$99<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Unlimited accounts</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> White-label options</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Team collaboration</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Priority support</li>
                <li className="flex items-center gap-3"><Star className="w-5 h-5 text-green-400" /> Custom integrations</li>
              </ul>
              <button 
                onClick={() => handlePricingClick('agency')}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
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
            onClick={handleEmailSubmit}
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