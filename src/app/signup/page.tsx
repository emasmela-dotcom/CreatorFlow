'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CreditCard } from 'lucide-react'
import PlanSelection, { PlanType, plans } from '@/components/PlanSelection'
import TrialTerms from '@/components/TrialTerms'

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedPlan = searchParams.get('plan') as PlanType | null

  const [step, setStep] = useState<'plan' | 'account' | 'payment'>(preSelectedPlan ? 'account' : 'plan')
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(preSelectedPlan)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePlanSelect = (plan: PlanType) => {
    setSelectedPlan(plan)
    // Auto-advance to account creation after selecting plan
    setTimeout(() => {
      setStep('account')
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPlan) {
      setError('Please select a plan')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Step 1: Create user account
      const signupResponse = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          action: 'signup',
          planType: selectedPlan, // Pass selected plan to API
        }),
      })

      const signupData = await signupResponse.json()

      if (!signupResponse.ok) {
        throw new Error(signupData.error || 'Failed to create account')
      }

      const { user, token } = signupData

      // Store token for next step
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Handle FREE plan - skip payment, activate directly
      if (selectedPlan === 'free') {
        try {
          const freePlanResponse = await fetch('/api/stripe/trial', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              planType: 'free',
            }),
          })

          const freePlanData = await freePlanResponse.json()
          
          if (freePlanResponse.ok) {
            // Free plan activated, redirect to dashboard
            router.push('/dashboard?plan=free&activated=true')
            return
          } else {
            throw new Error(freePlanData.error || 'Failed to activate free plan')
          }
        } catch (err: any) {
          setError(err.message || 'Failed to activate free plan')
          setLoading(false)
          return
        }
      }

      // Move to payment step (Stripe checkout) for paid plans
      setStep('payment')
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            CreatorFlow
          </h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center ${step === 'plan' ? 'text-purple-400' : step === 'account' || step === 'payment' ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step === 'plan' ? 'border-purple-400 bg-purple-400/10' : step === 'account' || step === 'payment' ? 'border-green-400 bg-green-400/10' : 'border-gray-600 bg-gray-800'
              }`}>
                {step !== 'plan' ? '✓' : '1'}
              </div>
              <span className="ml-2 font-medium">Select Plan</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-700" />
            <div className={`flex items-center ${step === 'account' ? 'text-purple-400' : step === 'payment' ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step === 'account' ? 'border-purple-400 bg-purple-400/10' : step === 'payment' ? 'border-green-400 bg-green-400/10' : 'border-gray-600 bg-gray-800'
              }`}>
                {step === 'payment' ? '✓' : '2'}
              </div>
              <span className="ml-2 font-medium">Create Account</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-700" />
            <div className={`flex items-center ${step === 'payment' ? 'text-purple-400' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step === 'payment' ? 'border-purple-400 bg-purple-400/10' : 'border-gray-600 bg-gray-800'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        {step === 'plan' && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-xl text-gray-400">
                Start your free trial with half a month (15 days) of any plan.
              </p>
              <p className="text-sm text-yellow-400 mt-2">
                ⚠️ Credit card required to start trial (no charge until trial ends)
              </p>
            </div>

            <PlanSelection
              selectedPlan={selectedPlan || undefined}
              onSelectPlan={handlePlanSelect}
            />

            {selectedPlan && (
              <>
                {/* Show Trial Terms BEFORE account creation */}
                <div className="mt-8">
                  <TrialTerms 
                    planName={plans.find(p => p.id === selectedPlan)?.name || selectedPlan}
                    planPrice={plans.find(p => p.id === selectedPlan)?.price || 0}
                  />
                </div>
                
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setStep('account')}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all"
                  >
                    Continue to Account Creation
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'account' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">Create Your Account</h2>
              {selectedPlan && (
                <p className="text-lg text-gray-400">
                  You're signing up for the <span className="text-purple-400 font-semibold">{selectedPlan}</span> plan
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl border border-gray-700 p-8 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Minimum 6 characters</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep('plan')}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedPlan}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Start Free Trial'}
                </button>
              </div>

              <p className="text-xs text-center text-gray-400">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        )}

        {step === 'payment' && selectedPlan && selectedPlan !== 'free' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">Complete Your Trial Setup</h2>
              <p className="text-lg text-gray-400">
                Add your payment method to start your free trial
              </p>
            </div>

            {/* Trial Terms Display */}
            <div className="mb-8">
              <TrialTerms 
                planName={plans.find(p => p.id === selectedPlan)?.name || selectedPlan}
                planPrice={plans.find(p => p.id === selectedPlan)?.price || 0}
              />
            </div>

            {/* Payment Button */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Ready to Start Your Trial?</h3>
                <p className="text-gray-400 mb-6">
                  You'll be redirected to secure Stripe checkout to add your payment method.
                  Your card will not be charged until after your 15-day trial ends.
                </p>
                
                <button
                  onClick={async () => {
                    setLoading(true)
                    setError('')
                    
                    try {
                      const token = localStorage.getItem('token')
                      if (!token) {
                        throw new Error('Session expired. Please sign in again.')
                      }

                      // Create Stripe checkout session with trial
                      const checkoutResponse = await fetch('/api/stripe/trial', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          planType: selectedPlan,
                        }),
                      })

                      const checkoutData = await checkoutResponse.json()

                      if (!checkoutResponse.ok) {
                        throw new Error(checkoutData.error || 'Failed to create checkout session')
                      }

                      // Handle FREE plan - redirect to dashboard
                      if (checkoutData.success && checkoutData.redirect) {
                        router.push(checkoutData.redirect)
                        return
                      }

                      // Redirect to Stripe checkout for paid plans
                      if (checkoutData.url) {
                        window.location.href = checkoutData.url
                      } else {
                        throw new Error('No checkout URL received')
                      }
                    } catch (err: any) {
                      setError(err.message || 'Failed to start checkout process')
                      setLoading(false)
                    }
                  }}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <CreditCard className="w-5 h-5" />
                  {loading ? 'Processing...' : 'Proceed to Secure Checkout'}
                </button>

                {error && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={() => setStep('account')}
                  className="mt-4 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ← Back to Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  )
}

