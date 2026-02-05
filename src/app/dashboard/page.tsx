'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Calendar, Users, TrendingUp, Plus, Settings, Bell, Search, FileText, FileSearch, Activity, Radio, Tag, Layers, Handshake, LogOut, Clock, TrendingDown, Eye, Heart, MessageCircle, Share2, HelpCircle, Link2, Sparkles, Wrench, DollarSign } from 'lucide-react'
import TrialStatusBanner from './components/TrialStatusBanner'
import HelpCenter from '@/components/HelpCenter'
import HelpIcon from '@/components/HelpIcon'
import PlatformConnections from '@/components/PlatformConnections'
import SocialListening from '@/components/SocialListening'
import TeamCollaboration from '@/components/TeamCollaboration'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import GameChangerFeatures from '@/components/GameChangerFeatures'
import FeedbackButton from '@/components/FeedbackButton'
import WhosOn from '@/components/WhosOn'
import CreatorChat from '@/components/CreatorChat'
import MessageBoard from '@/components/MessageBoard'
import ContentTypesSettings from '@/components/ContentTypesSettings'

// Simple UI Components for Bots
function ExpenseTrackerUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [expenseDate, setExpenseDate] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/expense-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          expenseDate,
          amount: parseFloat(amount),
          description
        })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - redirect to signin
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        if (data.upgradeRequired) {
          throw new Error(`This bot requires ${data.error.includes('Growth') ? 'Growth' : data.error.includes('Pro') ? 'Pro' : data.error.includes('Business') ? 'Business' : 'higher'} tier. Please upgrade your plan.`)
        }
        throw new Error(data.error || 'Failed to add expense')
      }
      setResult(data)
      setExpenseDate('')
      setAmount('')
      setDescription('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Date</label>
        <input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="0.00"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="What did you spend on?"
          required
        />
      </div>
      {!token && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-sm text-yellow-400">
          ⚠️ Please sign in to use this bot
          <button
            onClick={() => router.push('/signin')}
            className="ml-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs"
          >
            Sign In
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-sm">
          <div className="text-red-400 font-semibold">Error:</div>
          <div className="text-red-300 mt-1">{error}</div>
          {error.includes('tier') && (
            <button
              onClick={() => router.push('/')}
              className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      )}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
          <div className="text-green-400 font-semibold">✅ Expense added successfully!</div>
          <div className="text-gray-300 mt-1">Amount: ${result.expense?.amount}</div>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  )
}

function EmailSorterUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [from, setFrom] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/email-sorter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ from, subject, body })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - redirect to signin
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        if (data.upgradeRequired) {
          throw new Error(`This bot requires ${data.error.includes('Growth') ? 'Growth' : data.error.includes('Pro') ? 'Pro' : data.error.includes('Business') ? 'Business' : 'higher'} tier. Please upgrade your plan.`)
        }
        throw new Error(data.error || 'Failed to sort email')
      }
      setResult(data)
      setFrom('')
      setSubject('')
      setBody('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1">From</label>
        <input
          type="email"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="sender@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="Email subject"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="Email content..."
          rows={4}
          required
        />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
          <div className="text-green-400 font-semibold mb-2">Categorized:</div>
          <div className="text-gray-300">Category: {result.categorization?.category}</div>
          <div className="text-gray-300">Priority: {result.categorization?.priority}</div>
          {result.categorization?.isUrgent && <div className="text-red-400">⚠️ Urgent</div>}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Sorting...' : 'Sort Email'}
      </button>
    </form>
  )
}

function ContentWriterUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [type, setType] = useState('blog-post')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/content-writer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic, type, tone })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - redirect to signin
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        if (data.upgradeRequired) {
          throw new Error(`This bot requires ${data.error.includes('Growth') ? 'Growth' : data.error.includes('Pro') ? 'Pro' : data.error.includes('Business') ? 'Business' : 'higher'} tier. Please upgrade your plan.`)
        }
        throw new Error(data.error || 'Failed to generate content')
      }
      setResult(data)
      setTopic('')
      setType('blog-post')
      setTone('professional')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="What should the content be about?"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="blog-post">Blog Post</option>
            <option value="article">Article</option>
            <option value="social-post">Social Post</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
        </div>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
          <div className="text-green-400 font-semibold mb-2">Content Generated!</div>
          <div className="text-gray-300 whitespace-pre-wrap">{result.content?.content || 'Content created successfully'}</div>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Content'}
      </button>
    </form>
  )
}

function InvoiceGeneratorUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [clientName, setClientName] = useState('')
  const [invoiceDate, setInvoiceDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [itemDesc, setItemDesc] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unitPrice, setUnitPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/invoice-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clientId: 1, // Will need client management later
          invoiceDate,
          dueDate,
          items: [{
            description: itemDesc,
            quantity: parseFloat(quantity),
            unit_price: parseFloat(unitPrice)
          }]
        })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        throw new Error(data.error || 'Failed to create invoice')
      }
      setResult(data)
      setClientName('')
      setInvoiceDate('')
      setDueDate('')
      setItemDesc('')
      setQuantity('1')
      setUnitPrice('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Client Name</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="Client name"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Invoice Date</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Item Description</label>
        <input
          type="text"
          value={itemDesc}
          onChange={(e) => setItemDesc(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="Service or product name"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Quantity</label>
          <input
            type="number"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Unit Price</label>
          <input
            type="number"
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="0.00"
            required
          />
        </div>
      </div>
      {!token && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-sm text-yellow-400">
          ⚠️ Please sign in to use this bot
          <button
            onClick={() => router.push('/signin')}
            className="ml-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs"
          >
            Sign In
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-sm">
          <div className="text-red-400 font-semibold">Error:</div>
          <div className="text-red-300 mt-1">{error}</div>
        </div>
      )}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
          <div className="text-green-400 font-semibold mb-2">✅ Invoice Created!</div>
          <div className="text-gray-300">Invoice Number: {result.invoice?.invoice_number}</div>
          <div className="text-gray-300">Total: ${result.invoice?.total_amount}</div>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
    </form>
  )
}

function CustomerServiceUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/customer-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          customerName: customerName || 'Customer'
        })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - redirect to signin
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        throw new Error(data.error || 'Failed to process message')
      }
      setResult(data)
      setMessage('')
      setCustomerName('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Customer Name (Optional)</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="Customer name"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Customer Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="What is the customer asking?"
          rows={4}
          required
        />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
          <div className="text-green-400 font-semibold mb-2">Bot Response:</div>
          <div className="text-gray-300 whitespace-pre-wrap">{result.response}</div>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Get Bot Response'}
      </button>
    </form>
  )
}

function ProductRecommendationUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [preferences, setPreferences] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/product-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: category || undefined,
          preferences: preferences ? preferences.split(',').map(p => p.trim()) : undefined
        })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - redirect to signin
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        throw new Error(data.error || 'Failed to get recommendations')
      }
      setResult(data)
      setCategory('')
      setPreferences('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Category (Optional)</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="e.g., electronics, clothing"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Preferences (Optional)</label>
        <input
          type="text"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="e.g., wireless, portable, budget-friendly"
        />
        <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
          <div className="text-green-400 font-semibold mb-2">Recommended Products:</div>
          {result.recommendations?.map((rec: any, i: number) => (
            <div key={i} className="text-gray-300 mb-2">
              • {rec.name} - ${rec.price} (Score: {rec.score?.toFixed(0)})
            </div>
          ))}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
      </button>
    </form>
  )
}

function SalesLeadQualifierUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/sales-lead-qualifier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName,
          contactName,
          email,
          industry,
          companySize,
          jobTitle
        })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - redirect to signin
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        throw new Error(data.error || 'Failed to qualify lead')
      }
      setResult(data)
      setCompanyName('')
      setContactName('')
      setEmail('')
      setIndustry('')
      setCompanySize('')
      setJobTitle('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="Company name"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Contact Name</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="Contact name"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="email@example.com"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Industry</label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="e.g., Technology"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Company Size</label>
          <input
            type="text"
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="e.g., 100-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Job Title</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="e.g., CEO, Director"
        />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
          <div className="text-green-400 font-semibold mb-2">Lead Qualified!</div>
          <div className="text-gray-300">Score: {result.qualification?.score}/100</div>
          <div className="text-gray-300">Status: <span className={result.qualification?.status === 'qualified' ? 'text-green-400' : 'text-yellow-400'}>{result.qualification?.status}</span></div>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Qualifying...' : 'Qualify Lead'}
      </button>
    </form>
  )
}

function WebsiteChatUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [visitorName, setVisitorName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/website-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          visitorName: visitorName || 'Visitor'
        })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - redirect to signin
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        throw new Error(data.error || 'Failed to process message')
      }
      setResult(data)
      setMessage('')
      setVisitorName('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Visitor Name (Optional)</label>
        <input
          type="text"
          value={visitorName}
          onChange={(e) => setVisitorName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="Visitor name"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Visitor Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="What is the visitor asking?"
          rows={4}
          required
        />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
          <div className="text-green-400 font-semibold mb-2">Bot Response:</div>
          <div className="text-gray-300 whitespace-pre-wrap">{result.response}</div>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Get Bot Response'}
      </button>
    </form>
  )
}

function MeetingSchedulerUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [attendees, setAttendees] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/meeting-scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          attendees: attendees ? attendees.split(',').map(a => a.trim()) : [],
          location: location || undefined
        })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - redirect to signin
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        throw new Error(data.error || 'Failed to schedule meeting')
      }
      setResult(data)
      setTitle('')
      setStartTime('')
      setEndTime('')
      setAttendees('')
      setLocation('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Meeting Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="e.g., Client Consultation"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Attendees (Optional)</label>
        <input
          type="text"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="email1@example.com, email2@example.com"
        />
        <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Location (Optional)</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="e.g., Zoom, Office, Address"
        />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
          <div className="text-green-400 font-semibold mb-2">✅ Meeting Scheduled!</div>
          <div className="text-gray-300">Title: {result.meeting?.title}</div>
          <div className="text-gray-300">Date: {new Date(result.meeting?.start_time).toLocaleString()}</div>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Scheduling...' : 'Schedule Meeting'}
      </button>
    </form>
  )
}

function SocialMediaManagerUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [platform, setPlatform] = useState('instagram')
  const [content, setContent] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/social-media-manager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform,
          content,
          hashtags: hashtags ? hashtags.split(',').map(h => h.trim()) : [],
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined
        })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - redirect to signin
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        throw new Error(data.error || 'Failed to create post')
      }
      setResult(data)
      setContent('')
      setHashtags('')
      setScheduledAt('')
      setPlatform('instagram')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Platform</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
        >
          <option value="instagram">Instagram</option>
          <option value="twitter">Twitter</option>
          <option value="linkedin">LinkedIn</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="Write your post content..."
          rows={4}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Hashtags (Optional)</label>
        <input
          type="text"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="#hashtag1, #hashtag2, #hashtag3"
        />
        <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Schedule For (Optional)</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
        />
        <p className="text-xs text-gray-400 mt-1">Leave empty to post immediately</p>
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-sm">
          <div className="text-red-400 font-semibold">Error:</div>
          <div className="text-red-300 mt-1">{error}</div>
        </div>
      )}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
          <div className="text-green-400 font-semibold mb-2">✅ Post Created!</div>
          <div className="text-gray-300">Platform: {result.post?.platform}</div>
          <div className="text-gray-300">Status: {result.post?.status}</div>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}

function ContentRepurposingUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [originalContent, setOriginalContent] = useState('')
  const [contentType, setContentType] = useState('blog-post')
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(['instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handlePlatformToggle = (platform: string) => {
    if (targetPlatforms.includes(platform)) {
      setTargetPlatforms(targetPlatforms.filter(p => p !== platform))
    } else {
      setTargetPlatforms([...targetPlatforms, platform])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    if (!originalContent.trim()) {
      setError('Please enter content to repurpose')
      return
    }

    if (targetPlatforms.length === 0) {
      setError('Please select at least one platform')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/content-repurposing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          originalContent,
          contentType,
          targetPlatforms
        })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        throw new Error(data.error || 'Failed to repurpose content')
      }
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Content Type</label>
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
        >
          <option value="blog-post">Blog Post</option>
          <option value="article">Article</option>
          <option value="video-script">Video Script</option>
          <option value="social-media">Social Media Post</option>
          <option value="email">Email</option>
          <option value="newsletter">Newsletter</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Original Content</label>
        <textarea
          value={originalContent}
          onChange={(e) => setOriginalContent(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="Paste your original content here..."
          rows={6}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-2">Target Platforms</label>
        <div className="grid grid-cols-3 gap-2">
          {['instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest'].map((platform) => (
            <label key={platform} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={targetPlatforms.includes(platform)}
                onChange={() => handlePlatformToggle(platform)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300 capitalize">{platform}</span>
            </label>
          ))}
        </div>
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-sm">
          <div className="text-red-400 font-semibold">Error:</div>
          <div className="text-red-300 mt-1">{error}</div>
        </div>
      )}
      {result && (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
            <div className="text-green-400 font-semibold">✅ Content Repurposed Successfully!</div>
          </div>
          {result.repurposed && result.repurposed.map((item: any, index: number) => (
            <div key={index} className="bg-gray-800/50 border border-gray-700 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white capitalize">{item.platform}</h4>
                <span className="text-xs text-gray-400">{item.formatType} • {item.characterCount} chars</span>
              </div>
              <div className="bg-gray-900/50 rounded p-3 text-sm text-gray-300 whitespace-pre-wrap mb-2">
                {item.content}
              </div>
              {item.hashtags && item.hashtags.length > 0 && (
                <div className="text-xs text-purple-400">
                  {item.hashtags.join(' ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Repurposing...' : 'Repurpose Content'}
      </button>
    </form>
  )
}

// Hashtag Research UI
function HashtagResearchUI({ token, onClose }: { token: string, onClose: () => void }) {
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [savedSets, setSavedSets] = useState<any[]>([])
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveHashtags, setSaveHashtags] = useState('')
  const [error, setError] = useState('')

  const loadSavedSets = async () => {
    try {
      const response = await fetch('/api/hashtag-research?action=sets', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) setSavedSets(data.hashtagSets || [])
    } catch (err) {
      console.error('Failed to load saved sets:', err)
    }
  }

  React.useEffect(() => {
    if (token) loadSavedSets()
  }, [token])

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/hashtag-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'research',
          niche: niche || undefined,
          platform,
          content: content || undefined
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to research hashtags')
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!saveName || !saveHashtags) {
      setError('Name and hashtags are required')
      return
    }

    try {
      const response = await fetch('/api/hashtag-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'save',
          name: saveName,
          platform,
          hashtags: saveHashtags,
          description: `Saved on ${new Date().toLocaleDateString()}`
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save')
      setShowSaveForm(false)
      setSaveName('')
      setSaveHashtags('')
      loadSavedSets()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleResearch} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter/X</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Niche (Optional)</label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="fitness, business, tech, etc."
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Content (Optional - for recommendations)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            rows={3}
            placeholder="Paste your content to get hashtag recommendations..."
          />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white disabled:opacity-50"
        >
          {loading ? 'Researching...' : 'Research Hashtags'}
        </button>
      </form>

      {result && (
        <div className="space-y-4 mt-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
            <h4 className="font-semibold text-green-400 mb-2">Trending Hashtags ({result.niche})</h4>
            <div className="flex flex-wrap gap-2">
              {result.trending?.map((h: any, i: number) => (
                <span key={i} className="px-2 py-1 bg-gray-700 rounded text-sm">
                  {h.hashtag} <span className="text-gray-400">({h.reach})</span>
                </span>
              ))}
            </div>
          </div>
          {result.recommended && result.recommended.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4">
              <h4 className="font-semibold text-blue-400 mb-2">Recommended for Your Content</h4>
              <div className="flex flex-wrap gap-2">
                {result.recommended.map((h: any, i: number) => (
                  <span key={i} className="px-2 py-1 bg-gray-700 rounded text-sm">
                    {h.hashtag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => {
              const allHashtags = [
                ...(result.trending || []).map((h: any) => h.hashtag),
                ...(result.recommended || []).map((h: any) => h.hashtag)
              ].join(' ')
              setSaveHashtags(allHashtags)
              setShowSaveForm(true)
            }}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
          >
            Save as Hashtag Set
          </button>
        </div>
      )}

      {showSaveForm && (
        <div className="bg-gray-900/50 border border-gray-700 rounded p-4 space-y-3">
          <h4 className="font-semibold">Save Hashtag Set</h4>
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="Set name (e.g., Fitness Posts)"
          />
          <textarea
            value={saveHashtags}
            onChange={(e) => setSaveHashtags(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            rows={3}
            placeholder="Hashtags separated by spaces"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveForm(false)
                setSaveName('')
                setSaveHashtags('')
              }}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {savedSets.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Saved Hashtag Sets</h4>
          <div className="space-y-2">
            {savedSets.map((set: any) => (
              <div key={set.id} className="bg-gray-800 p-3 rounded border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{set.name}</div>
                    {set.platform && <div className="text-xs text-gray-400">{set.platform}</div>}
                  </div>
                  <button
                    onClick={async () => {
                      if (confirm('Delete this hashtag set?')) {
                        await fetch(`/api/hashtag-research?id=${set.id}`, {
                          method: 'DELETE',
                          headers: { 'Authorization': `Bearer ${token}` }
                        })
                        loadSavedSets()
                      }
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-sm text-gray-300">{set.hashtags}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Content Templates UI
function ContentTemplatesUI({ token, onClose }: { token: string, onClose: () => void }) {
  const [templates, setTemplates] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/content-templates', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) setTemplates(data.templates || [])
    } catch (err) {
      console.error('Failed to load templates:', err)
    }
  }

  React.useEffect(() => {
    if (token) loadTemplates()
  }, [token])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !content) {
      setError('Name and content are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/content-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editingTemplate?.id,
          name,
          platform,
          content,
          category: category || null,
          description: description || null
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save template')
      
      setShowForm(false)
      setEditingTemplate(null)
      setName('')
      setContent('')
      setCategory('')
      setDescription('')
      loadTemplates()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (template: any) => {
    setEditingTemplate(template)
    setName(template.name)
    setPlatform(template.platform || 'instagram')
    setContent(template.content)
    setCategory(template.category || '')
    setDescription(template.description || '')
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this template?')) return

    try {
      const response = await fetch(`/api/content-templates?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to delete')
      loadTemplates()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Content Templates</h3>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingTemplate(null)
            setName('')
            setContent('')
            setCategory('')
            setDescription('')
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
        >
          + New Template
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-gray-900/50 border border-gray-700 rounded p-4 space-y-3">
          <h4 className="font-semibold">{editingTemplate ? 'Edit' : 'New'} Template</h4>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="Template name"
            required
          />
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter/X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            rows={6}
            placeholder="Template content (use {variable} for placeholders)"
            required
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="Category (optional)"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            rows={2}
            placeholder="Description (optional)"
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingTemplate(null)
              }}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {templates.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No templates yet. Create your first template!
          </div>
        ) : (
          templates.map((template: any) => (
            <div key={template.id} className="bg-gray-800 p-4 rounded border border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{template.name}</div>
                  {template.platform && (
                    <div className="text-xs text-gray-400">{template.platform}</div>
                  )}
                  {template.category && (
                    <div className="text-xs text-gray-400">Category: {template.category}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(template.content)
                      alert('Template copied to clipboard!')
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="text-yellow-400 hover:text-yellow-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-300 whitespace-pre-wrap">{template.content}</div>
              {template.description && (
                <div className="text-xs text-gray-400 mt-2">{template.description}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Engagement Inbox UI
function EngagementInboxUI({ token, onClose }: { token: string, onClose: () => void }) {
  const [engagements, setEngagements] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState({ status: 'all', platform: 'all', type: 'all' })
  const [loading, setLoading] = useState(false)

  const loadEngagements = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter.status !== 'all') params.append('status', filter.status)
      if (filter.platform !== 'all') params.append('platform', filter.platform)
      if (filter.type !== 'all') params.append('type', filter.type)

      const response = await fetch(`/api/engagement-inbox?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setEngagements(data.engagements || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (err) {
      console.error('Failed to load engagements:', err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (token) loadEngagements()
  }, [token, filter])

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch('/api/engagement-inbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'update', id, status })
      })
      const data = await response.json()
      if (data.success) loadEngagements()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          Engagement Inbox
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-500 rounded text-sm">
              {unreadCount} unread
            </span>
          )}
        </h3>
      </div>

      <div className="flex gap-2 flex-wrap">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={filter.platform}
          onChange={(e) => setFilter({ ...filter, platform: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
        >
          <option value="all">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="twitter">Twitter</option>
          <option value="linkedin">LinkedIn</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
        </select>
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
        >
          <option value="all">All Types</option>
          <option value="comment">Comments</option>
          <option value="message">Messages</option>
          <option value="mention">Mentions</option>
          <option value="reply">Replies</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : engagements.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No engagements found. Add engagements manually or integrate with social platforms.
        </div>
      ) : (
        <div className="space-y-2">
          {engagements.map((eng: any) => (
            <div
              key={eng.id}
              className={`bg-gray-800 p-4 rounded border ${
                eng.status === 'unread' ? 'border-yellow-500/50' : 'border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">
                    {eng.author_name || eng.author_handle || 'Anonymous'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {eng.platform} • {eng.type} • {new Date(eng.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  {eng.status === 'unread' && (
                    <button
                      onClick={() => updateStatus(eng.id, 'read')}
                      className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                    >
                      Mark Read
                    </button>
                  )}
                  <select
                    value={eng.status}
                    onChange={(e) => updateStatus(eng.id, e.target.value)}
                    className="text-xs px-2 py-1 bg-gray-700 rounded text-white"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-300">{eng.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ContentGapAnalyzerUI({ token, onClose }: { token: string, onClose: () => void }) {
  const router = useRouter()
  const [niche, setNiche] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [competitorTopics, setCompetitorTopics] = useState('')
  const [yourTopics, setYourTopics] = useState('')
  const [competitorFormats, setCompetitorFormats] = useState('')
  const [yourFormats, setYourFormats] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please sign in to use this bot')
      return
    }

    if (!competitorTopics.trim()) {
      setError('Please enter at least one competitor topic')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/bots/content-gap-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          niche: niche || undefined,
          targetAudience: targetAudience || undefined,
          competitorTopics: competitorTopics.split('\n').filter(t => t.trim()).map(t => t.trim()),
          yourTopics: yourTopics ? yourTopics.split('\n').filter(t => t.trim()).map(t => t.trim()) : [],
          competitorFormats: competitorFormats ? competitorFormats.split(',').filter(f => f.trim()).map(f => f.trim()) : [],
          yourFormats: yourFormats ? yourFormats.split(',').filter(f => f.trim()).map(f => f.trim()) : []
        })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token')
          router.push('/signin')
          throw new Error('Session expired. Please sign in again.')
        }
        throw new Error(data.error || 'Failed to analyze content gaps')
      }
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Niche (Optional)</label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="e.g., Fitness, Tech, Marketing"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Target Audience (Optional)</label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="e.g., Small business owners"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Competitor Topics *</label>
        <textarea
          value={competitorTopics}
          onChange={(e) => setCompetitorTopics(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="Enter competitor topics, one per line:&#10;How to start a business&#10;Marketing strategies&#10;SEO tips"
          rows={5}
          required
        />
        <p className="text-xs text-gray-400 mt-1">One topic per line</p>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Your Topics (Optional)</label>
        <textarea
          value={yourTopics}
          onChange={(e) => setYourTopics(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          placeholder="Enter your existing topics, one per line:&#10;Social media marketing&#10;Content creation"
          rows={4}
        />
        <p className="text-xs text-gray-400 mt-1">One topic per line</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Competitor Formats (Optional)</label>
          <input
            type="text"
            value={competitorFormats}
            onChange={(e) => setCompetitorFormats(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="blog-post, video, carousel"
          />
          <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Your Formats (Optional)</label>
          <input
            type="text"
            value={yourFormats}
            onChange={(e) => setYourFormats(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="blog-post, video"
          />
          <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
        </div>
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-sm">
          <div className="text-red-400 font-semibold">Error:</div>
          <div className="text-red-300 mt-1">{error}</div>
        </div>
      )}
      {result && (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-sm">
            <div className="text-green-400 font-semibold">✅ Analysis Complete!</div>
            <div className="text-gray-300 mt-2">
              <div>Found {result.gaps?.topics?.length || 0} content gaps</div>
              <div>You have {result.gaps?.yourUniqueTopics?.length || 0} unique topics</div>
            </div>
          </div>
          
          {result.insights && result.insights.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Key Insights:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                {result.insights.map((insight: string, index: number) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Top Content Suggestions:</h4>
              <div className="space-y-2">
                {result.suggestions.map((suggestion: any, index: number) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h5 className="text-sm font-semibold text-white">{suggestion.topic}</h5>
                      <span className="text-xs text-purple-400">Priority: {suggestion.priorityScore}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">
                      Format: <span className="text-gray-300 capitalize">{suggestion.format?.replace('-', ' ')}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">
                      Angle: <span className="text-gray-300">{suggestion.angle}</span>
                    </div>
                    <div className="text-xs text-gray-500">{suggestion.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.gaps?.yourUniqueTopics && result.gaps.yourUniqueTopics.length > 0 && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3">
              <h4 className="text-sm font-semibold text-purple-400 mb-2">Your Unique Advantages:</h4>
              <div className="text-sm text-gray-300">
                {result.gaps.yourUniqueTopics.join(', ')}
              </div>
              <p className="text-xs text-purple-300 mt-2">These are topics you cover that competitors don't - leverage them!</p>
            </div>
          )}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Content Gaps'}
      </button>
    </form>
  )
}
// AI Tool components - commented out until components are created
// import BrandVoiceTool from '@/components/ai/BrandVoiceTool'
// import HashtagOptimizerTool from '@/components/ai/HashtagOptimizerTool'
// import ContentGapTool from '@/components/ai/ContentGapTool'
// import EngagementPredictorTool from '@/components/ai/EngagementPredictorTool'
// import ViralDetectorTool from '@/components/ai/ViralDetectorTool'
// import ReformatterTool from '@/components/ai/ReformatterTool'
// import CollaborationMatchmakerTool from '@/components/ai/CollaborationMatchmakerTool'
// import SentimentTool from '@/components/ai/SentimentTool'
import LockedContentBadge, { LockedContentIcon } from '@/components/LockedContentBadge'

// Content Calendar Component
function CalendarView({ token }: { token: string }) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    loadCalendarEvents()
  }, [currentMonth])

  const loadCalendarEvents = async () => {
    try {
      const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
      
      const response = await fetch(`/api/calendar?startDate=${start.toISOString().split('T')[0]}&endDate=${end.toISOString().split('T')[0]}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Failed to load calendar:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  const getEventsForDate = (day: number | null) => {
    if (!day) return []
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.date === dateStr)
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Calendar</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading calendar...</div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-gray-400 py-2">
                {day}
              </div>
            ))}
            {getDaysInMonth().map((day, idx) => {
              const dayEvents = getEventsForDate(day)
              return (
                <div
                  key={idx}
                  className={`min-h-[80px] p-2 border border-gray-700 rounded ${day ? 'bg-gray-900 hover:bg-gray-800 cursor-pointer' : 'bg-gray-800/50'}`}
                  onClick={() => day && setSelectedDate(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                >
                  {day && (
                    <>
                      <div className="text-sm font-semibold mb-1">{day}</div>
                      {dayEvents.slice(0, 2).map((event: any) => (
                        <div key={event.id} className="text-xs bg-purple-600/30 text-purple-300 rounded px-1 mb-1 truncate">
                          {event.platform}: {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-400">+{dayEvents.length - 2} more</div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {selectedDate && (
          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <h4 className="font-semibold mb-3">Events on {new Date(selectedDate).toLocaleDateString()}</h4>
            <div className="space-y-2">
              {getEventsForDate(parseInt(selectedDate.split('-')[2])).map((event: any) => (
                <div key={event.id} className="p-3 bg-gray-800 rounded border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-sm text-gray-400">{event.platform} • {event.status}</div>
                      {event.scheduledAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(event.scheduledAt).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {getEventsForDate(parseInt(selectedDate.split('-')[2])).length === 0 && (
                <div className="text-gray-400 text-center py-4">No events scheduled</div>
              )}
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Performance Analytics Component
function PerformanceAnalyticsView({ token }: { token: string }) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    loadAnalytics()
  }, [days])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/performance?days=${days}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-12 text-gray-400">No analytics data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Analytics</h2>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Posts</p>
              <p className="text-2xl font-bold">{analytics.overview.totalPosts}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Engagement</p>
              <p className="text-2xl font-bold">{analytics.overview.totalEngagement.toLocaleString()}</p>
            </div>
            <Heart className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Engagement</p>
              <p className="text-2xl font-bold">{analytics.overview.avgEngagement}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Growth Rate</p>
              <p className={`text-2xl font-bold ${analytics.overview.growthRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analytics.overview.growthRate >= 0 ? '+' : ''}{analytics.overview.growthRate}%
              </p>
            </div>
            {analytics.overview.growthRate >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-400" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400" />
            )}
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">By Platform</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(analytics.byPlatform.posts).map(([platform, count]: [string, any]) => (
            <div key={platform} className="text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-gray-400 capitalize">{platform}</div>
              <div className="text-xs text-gray-500">
                {analytics.byPlatform.engagement[platform] || 0} engagement
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Posts */}
      {analytics.topPosts.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Top Performing Posts</h3>
          <div className="space-y-3">
            {analytics.topPosts.slice(0, 5).map((post: any, idx: number) => (
              <div key={post.id} className="flex items-start justify-between p-4 bg-gray-900 rounded border border-gray-700">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-400 font-bold">#{idx + 1}</span>
                    <span className="text-sm text-gray-400 capitalize">{post.platform}</span>
                  </div>
                  <div className="text-sm text-gray-300 truncate">{post.content}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-green-400">{post.engagement.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">engagement</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null)
  const [postInfo, setPostInfo] = useState<{
    monthlyLimit: number | null
    purchased: number
    postsThisMonth: number
    totalAvailable: number
    remaining: number
    packages: Array<{ quantity: number; price: number; savings: string }>
  } | null>(null)
  const [posts, setPosts] = useState<Array<{
    id: string
    platform: string
    content: string
    scheduled_at: string | null
    status: string
    isLocked?: boolean
    created_at: string
  }>>([])
  const [openAITool, setOpenAITool] = useState<string | null>(null)
  const [token, setToken] = useState<string>('')
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [helpCenterOpen, setHelpCenterOpen] = useState(false)
  const [headerSearch, setHeaderSearch] = useState('')
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    // Get token from localStorage on client side
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token') || ''
      setToken(storedToken)
      
      // Get user ID
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUserId(userData.id || userData.userId || '')
        } catch (e) {
          console.error('Failed to parse user data:', e)
        }
      }
      
      // Redirect to signin if no token (unless coming from demo)
      if (!storedToken) {
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('demo') !== 'true') {
          router.push('/signin')
        }
      }
    }
  }, [router])

  const analytics = {
    totalFollowers: 125000,
    engagementRate: 4.2,
    reach: 45000,
    impressions: 180000
  }

  useEffect(() => {
    // Fetch user subscription tier and post info
    const token = localStorage.getItem('token')
    if (token) {
      // Fetch subscription
      fetch('/api/subscription/manage', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setSubscriptionTier(data.plan || null)
      })
      .catch(err => console.error('Error fetching subscription:', err))

      // Fetch post purchase info
      fetch('/api/user/purchase-posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setPostInfo({
            monthlyLimit: data.monthlyLimit,
            purchased: data.purchasedPosts || 0,
            postsThisMonth: data.postsThisMonth || 0,
            totalAvailable: data.totalAvailable || 0,
            remaining: data.remaining || 0,
            packages: data.packages || []
          })
        }
      })
      .catch(err => console.error('Error fetching post info:', err))

      // Fetch posts with lock status
      fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.posts) {
          setPosts(data.posts)
        }
      })
      .catch(err => console.error('Error fetching posts:', err))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header: thinner; row 1 = CreatorFlow365 + search (left) | controls (right); row 2 = nav in middle */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-2">
        {/* Row 1: Brand with search bar UNDER it (left), Help/Bell/Settings/Sign Out (right) */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex flex-col gap-1.5 shrink-0">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent whitespace-nowrap leading-tight">
              CreatorFlow365
            </h1>
            <form
              className="relative flex items-center w-52 sm:w-72 min-h-[2.25rem] flex-shrink-0"
              onSubmit={(e) => {
                e.preventDefault()
                const q = headerSearch.trim()
                if (q) router.push(`/documents?search=${encodeURIComponent(q)}`)
                else router.push('/documents')
              }}
            >
              <Search className="absolute left-3 w-4 h-4 text-gray-600 pointer-events-none shrink-0" aria-hidden />
              <input
                type="search"
                placeholder="Search content..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="w-full min-h-[2.25rem] pl-9 pr-3 py-1.5 text-sm bg-white border-2 border-gray-700 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                aria-label="Search content"
              />
            </form>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button onClick={() => setHelpCenterOpen(true)} className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-700 rounded-lg transition-colors" title="Help Center">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white cursor-pointer" />
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white cursor-pointer" />
            <button
              onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/signin') }}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors whitespace-nowrap"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        {/* Row 2: Nav centered in the header section */}
        <div className="w-full flex justify-center">
        <nav className="flex flex-col gap-1 items-center">
          <div className="flex flex-wrap items-center gap-1.5">
            <button className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-purple-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-colors ${activeTab === 'content' ? 'bg-purple-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('content')}>Content</button>
            <button className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-colors ${activeTab === 'calendar' ? 'bg-purple-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('calendar')}><Calendar className="w-4 h-4 inline mr-1.5 -mt-0.5" />Calendar</button>
            <button className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-purple-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
            <button className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-colors ${activeTab === 'collaborations' ? 'bg-purple-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('collaborations')}>Collaborations</button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors hover:bg-gray-700" onClick={() => router.push('/create')}><Plus className="w-3 h-3 inline mr-1 -mt-0.5" />Create</button>
            <button className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors hover:bg-gray-700" onClick={() => router.push('/documents')}><FileText className="w-3 h-3 inline mr-1 -mt-0.5" />Documents</button>
            <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'connections' ? 'bg-purple-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('connections')}><Link2 className="w-3 h-3 inline mr-1 -mt-0.5" />Connections</button>
            <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'game-changers' ? 'bg-purple-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('game-changers')}><Wrench className="w-3 h-3 inline mr-1 -mt-0.5" />Tools</button>
            <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'social-listening' ? 'bg-purple-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('social-listening')}><Search className="w-3 h-3 inline mr-1 -mt-0.5" />Listening</button>
            <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'game-changers' ? 'bg-purple-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('game-changers')}><Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />Game-Changers</button>
            <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'community' ? 'bg-purple-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('community')}><Users className="w-3 h-3 inline mr-1 -mt-0.5" />Community</button>
            <button className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors hover:bg-gray-700" onClick={() => router.push('/pricing')}><DollarSign className="w-3 h-3 inline mr-1 -mt-0.5" />Pricing</button>
          </div>
        </nav>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Followers</span>
                  <span className="font-semibold">{analytics.totalFollowers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Engagement</span>
                  <span className="font-semibold">{analytics.engagementRate}%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-300">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/create')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Post
                </button>
                <button
                  onClick={() => router.push('/create')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
                <button
                  onClick={() => router.push('/analytics')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-300">Recent Activity</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-gray-700 rounded">
                  <p className="text-gray-300">Post scheduled for Instagram</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="p-2 bg-gray-700 rounded">
                  <p className="text-gray-300">New collaboration request</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                router.push('/signin')
              }}
              className="w-full flex items-center justify-center gap-2 p-3 mt-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <TrialStatusBanner />
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Followers</p>
                      <p className="text-2xl font-bold">{analytics.totalFollowers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex items-center mt-2 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% this month
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Engagement Rate</p>
                      <p className="text-2xl font-bold">{analytics.engagementRate}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex items-center mt-2 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +0.8% this month
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Reach</p>
                      <p className="text-2xl font-bold">{analytics.reach.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex items-center mt-2 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +18% this month
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Impressions</p>
                      <p className="text-2xl font-bold">{analytics.impressions.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div className="flex items-center mt-2 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +25% this month
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {posts.slice(0, 5).map((post) => (
                      <div key={post.id} className={`flex items-center justify-between p-4 rounded-lg ${
                        post.isLocked ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-gray-700'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            post.status === 'scheduled' ? 'bg-yellow-400' : 
                            post.status === 'published' ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{post.platform}</p>
                              {post.isLocked && <LockedContentIcon />}
                            </div>
                            <p className="text-sm text-gray-400 truncate max-w-xs">{post.content}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {post.scheduled_at 
                              ? new Date(post.scheduled_at).toLocaleDateString() 
                              : new Date(post.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">{post.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sunset Photography</p>
                        <p className="text-sm text-gray-400">Instagram • 2 days ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">2.4K likes</p>
                        <p className="text-sm text-green-400">+15% engagement</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Course Launch</p>
                        <p className="text-sm text-gray-400">Twitter • 1 week ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">1.8K retweets</p>
                        <p className="text-sm text-green-400">+22% engagement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Content Management</h2>
                  <HelpIcon 
                    content="Manage all your content here: documents, templates, hashtag sets, and engagement. Use the tools below to research hashtags, create templates, and track engagement."
                    title="Content Management"
                  />
                </div>
                <button
                  onClick={() => router.push('/create')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create New Post
                </button>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No posts yet. Create your first post!</p>
                  <button
                    onClick={() => router.push('/create')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all"
                  >
                    Create Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <div 
                      key={post.id} 
                      className={`bg-gray-800 p-6 rounded-lg border ${
                        post.isLocked 
                          ? 'border-blue-500/50 bg-blue-500/5' 
                          : 'border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                            {post.platform}
                          </span>
                          {post.isLocked && <LockedContentIcon />}
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          post.status === 'scheduled' ? 'bg-yellow-500 text-black' : 
                          post.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      
                      {post.isLocked && (
                        <LockedContentBadge 
                          message="This content is locked"
                          showUpgradeButton={true}
                          size="sm"
                        />
                      )}
                      
                      <p className="text-gray-300 mb-4 mt-4">{post.content}</p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                        <span>
                          {post.scheduled_at 
                            ? new Date(post.scheduled_at).toLocaleDateString() 
                            : new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (post.isLocked) {
                              alert('This content is locked. Upgrade to edit it.')
                              return
                            }
                            // Handle edit
                            console.log('Edit post', post.id)
                          }}
                          disabled={post.isLocked}
                          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                            post.isLocked
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {post.isLocked ? '🔒 Locked' : 'Edit'}
                        </button>
                        <button
                          onClick={() => {
                            if (post.isLocked) {
                              alert('This content is locked. Upgrade to export it.')
                              return
                            }
                            // Handle export
                            console.log('Export post', post.id)
                          }}
                          disabled={post.isLocked}
                          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                            post.isLocked
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-purple-600 hover:bg-purple-700'
                          }`}
                        >
                          {post.isLocked ? '🔒 Locked' : 'Export'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <AdvancedAnalytics token={token} />
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-6">
              <PlatformConnections token={token} />
            </div>
          )}

          {activeTab === 'social-listening' && (
            <div className="space-y-6">
              <SocialListening token={token} />
            </div>
          )}

          {activeTab === 'game-changers' && (
            <div className="space-y-6">
              <GameChangerFeatures token={token} />
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <WhosOn token={token} />
                </div>
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <CreatorChat token={token} />
                    <MessageBoard token={token} />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <ContentTypesSettings token={token} />
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <WhosOn token={token} />
                </div>
                <div className="lg:col-span-2">
                  <ContentTypesSettings token={token} />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Real-Time Chat</h3>
                  <CreatorChat token={token} />
                </div>
                <div>
                  <MessageBoard token={token} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'collaborations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Brand Collaborations</h2>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Active Partnerships</h3>
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p>No active collaborations yet</p>
                  <p className="text-sm">Start reaching out to brands to grow your partnerships</p>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Additional Posts Section */}
          {activeTab === 'overview' && postInfo && (
            <div className="space-y-6 mt-6">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Post Usage</h3>
                    <p className="text-gray-300 text-sm">
                      Monthly limit: <span className="font-semibold">{postInfo.monthlyLimit || 0} posts</span> • 
                      Purchased: <span className="font-semibold text-green-400">{postInfo.purchased} posts</span> • 
                      Used this month: <span className="font-semibold">{postInfo.postsThisMonth}</span>
                    </p>
                    <p className="text-purple-400 text-sm mt-2 font-semibold">
                      Remaining: {postInfo.remaining} posts • Purchased posts roll over forever
                    </p>
                  </div>
                  {postInfo.remaining < 5 && (
                    <div className="bg-yellow-500/20 border border-yellow-500 px-4 py-2 rounded-lg">
                      <p className="text-yellow-400 font-semibold text-sm">Low on posts</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-blue-500/30 pt-4">
                  <h4 className="font-semibold mb-3">Buy Additional Posts</h4>
                  
                  {/* Rollover Logic Explanation */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                      How Post Rollover Works
                    </h5>
                    <ul className="text-sm text-gray-300 space-y-2 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">1.</span>
                        <span><strong className="text-white">Monthly posts</strong> reset each month (from your plan)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">2.</span>
                        <span><strong className="text-green-400">Purchased posts</strong> never expire and roll over forever</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">3.</span>
                        <span><strong className="text-white">Monthly posts are used first</strong>, then purchased posts are used</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span><strong className="text-purple-400">Example:</strong> If you buy 20 posts and use all 15 monthly posts, those 20 purchased posts carry over to next month</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    {postInfo.packages.map((pkg, idx) => (
                      <div 
                        key={idx}
                        className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
                        onClick={async () => {
                          const token = localStorage.getItem('token')
                          if (!token) return
                          
                          try {
                            const res = await fetch('/api/user/purchase-posts', {
                              method: 'POST',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({ 
                                quantity: pkg.quantity, 
                                packageIndex: idx 
                              })
                            })
                            const data = await res.json()
                            if (data.url) {
                              window.location.href = data.url
                            }
                          } catch (err) {
                            console.error('Purchase error:', err)
                            alert('Error initiating purchase. Please try again.')
                          }
                        }}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400 mb-1">${pkg.price}</div>
                          <div className="text-sm text-gray-300 mb-1">{pkg.quantity} Posts</div>
                          <div className="text-xs text-green-400 mb-2">{pkg.savings} Savings</div>
                          <div className="text-xs text-gray-400">${(pkg.price / pkg.quantity).toFixed(2)}/post</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* AI Tool Panels - Available to All Paying Subscribers */}
          {subscriptionTier && (
            <>
              {/* Brand Voice and Hashtag Optimizer tools will be added here when AIToolPanel is created */}
            </>
          )}

          {/* Bot Modal */}
          {selectedBot && (() => {
            const botDocs: Record<string, { title: string; description: string; useCase: string; howToUse: string[]; tier: string; example?: string }> = {
              'expense-tracker': {
                title: 'Expense Tracker Bot',
                description: 'Track and manage all your business expenses with automatic categorization, budget management, and financial reporting.',
                useCase: 'Perfect for freelancers, small businesses, and anyone who needs to track expenses for tax purposes or budget management.',
                tier: 'All Plans',
                howToUse: [
                  'Add expenses by providing date, amount, description, and optional category',
                  'Set budgets by category to track spending limits',
                  'View expense reports and analytics',
                  'Export data for accounting or tax purposes',
                  'Track recurring expenses automatically'
                ],
                example: 'POST /api/bots/expense-tracker\n{\n  "expenseDate": "2024-01-15",\n  "amount": 50.00,\n  "description": "Office supplies",\n  "categoryId": 1\n}'
              },
              'invoice-generator': {
                title: 'Invoice Generator Bot',
                description: 'Create professional invoices, track payments, manage clients, and automate your billing process.',
                useCase: 'Ideal for freelancers, consultants, agencies, and small businesses that need to invoice clients regularly.',
                tier: 'All Plans',
                howToUse: [
                  'Add clients to your client database',
                  'Create invoices with line items, tax, and discounts',
                  'Track invoice status (draft, sent, paid, overdue)',
                  'Record payments and view outstanding balances',
                  'Generate financial reports and aging reports',
                  'Set up automatic payment reminders'
                ],
                example: 'POST /api/bots/invoice-generator\n{\n  "clientId": 1,\n  "invoiceDate": "2024-01-15",\n  "dueDate": "2024-02-15",\n  "items": [{"description": "Web Design", "quantity": 10, "unit_price": 100}]\n}'
              },
              'email-sorter': {
                title: 'Email Sorter Bot',
                description: 'Automatically categorize and prioritize your emails using AI, so you can focus on what matters most.',
                useCase: 'Great for busy professionals who receive many emails and need automatic organization and prioritization.',
                tier: 'All Plans',
                howToUse: [
                  'Send email data (from, subject, body) to the API',
                  'Bot automatically categorizes emails (urgent, sales, support, etc.)',
                  'Get priority level (low, normal, high, urgent)',
                  'View sorted emails by category or priority',
                  'Set up custom categories for your business needs'
                ],
                example: 'POST /api/bots/email-sorter\n{\n  "from": "client@example.com",\n  "subject": "Urgent: Project Update",\n  "body": "We need to discuss the project..."\n}'
              },
              'customer-service': {
                title: 'Customer Service Bot',
                description: 'AI-powered customer support chatbot that handles inquiries, answers questions, and escalates when needed.',
                useCase: 'Perfect for businesses that want 24/7 customer support without hiring a full support team.',
                tier: 'All Plans',
                howToUse: [
                  'Add knowledge base entries with common questions and answers',
                  'Configure bot settings (greeting message, escalation rules)',
                  'Chat widget automatically responds to customer inquiries',
                  'View all conversations in the admin dashboard',
                  'Bot escalates to human support when needed',
                  'Track analytics and customer satisfaction'
                ],
                example: 'POST /api/bots/customer-service\n{\n  "message": "What are your business hours?",\n  "conversationId": "conv_123",\n  "customerName": "John Doe"\n}'
              },
              'product-recommendation': {
                title: 'Product Recommendation Bot',
                description: 'AI-powered product recommendation engine that suggests products to customers based on their preferences and purchase history.',
                useCase: 'Essential for e-commerce stores, marketplaces, and businesses selling multiple products who want to increase sales through personalized recommendations.',
                tier: 'All Plans',
                howToUse: [
                  'Add products to your catalog with categories and details',
                  'Track customer purchase history and preferences',
                  'Bot analyzes customer data and product attributes',
                  'Get personalized product recommendations for each customer',
                  'View recommendation analytics and conversion rates',
                  'A/B test different recommendation strategies'
                ],
                example: 'POST /api/bots/product-recommendation\n{\n  "customerId": 123,\n  "category": "electronics",\n  "preferences": ["wireless", "portable"]\n}'
              },
              'sales-lead-qualifier': {
                title: 'Sales Lead Qualifier Bot',
                description: 'Automatically score and qualify sales leads to help your sales team focus on the most promising opportunities.',
                useCase: 'Ideal for sales teams, B2B businesses, and anyone who needs to prioritize leads and improve conversion rates.',
                tier: 'All Plans',
                howToUse: [
                  'Submit lead information (company, contact, industry, etc.)',
                  'Bot calculates qualification score (0-100) based on multiple factors',
                  'Leads are automatically marked as qualified or unqualified',
                  'Get AI-powered recommendations for each lead',
                  'View all leads in dashboard sorted by score',
                  'Export qualified leads for your sales team'
                ],
                example: 'POST /api/bots/sales-lead-qualifier\n{\n  "companyName": "Acme Corp",\n  "contactName": "John Doe",\n  "email": "john@acme.com",\n  "industry": "Technology",\n  "companySize": "100-500"\n}'
              },
              'website-chat': {
                title: 'Website Chat Bot',
                description: 'Live chat widget for your website that engages visitors, answers questions, and captures leads 24/7.',
                useCase: 'Perfect for any business website that wants to engage visitors, answer questions, and convert more leads.',
                tier: 'All Plans',
                howToUse: [
                  'Embed the chat widget code on your website',
                  'Configure bot settings (greeting, responses, business hours)',
                  'Chat widget appears on your website automatically',
                  'Visitors can chat and get instant responses',
                  'View all conversations in admin dashboard',
                  'Export leads and conversation transcripts'
                ],
                example: 'POST /api/bots/website-chat\n{\n  "message": "Hello, I have a question",\n  "sessionId": "sess_123",\n  "visitorName": "Jane Doe",\n  "pageUrl": "https://yoursite.com/products"\n}'
              },
              'content-writer': {
                title: 'Content Writer Bot',
                description: 'AI-powered content generation tool that creates blog posts, articles, social media content, and more based on your topics and requirements.',
                useCase: 'Great for content creators, marketers, bloggers, and businesses that need to produce high-quality content consistently.',
                tier: 'All Plans',
                howToUse: [
                  'Provide topic, content type (blog post, article, social post), and tone',
                  'Specify length, platform, and target keywords',
                  'Bot generates content based on your requirements',
                  'Review and edit generated content',
                  'Save drafts and publish when ready',
                  'Track content performance and optimize'
                ],
                example: 'POST /api/bots/content-writer\n{\n  "topic": "AI Technology Trends",\n  "type": "blog-post",\n  "tone": "professional",\n  "length": 1000,\n  "platform": "blog",\n  "keywords": ["AI", "technology", "trends"]\n}'
              },
              'meeting-scheduler': {
                title: 'Meeting Scheduler Bot',
                description: 'Advanced meeting scheduling system with automatic reminders, calendar integration, and conflict detection.',
                useCase: 'Perfect for consultants, coaches, service businesses, and anyone who schedules meetings regularly and wants to automate the process.',
                tier: 'All Plans',
                howToUse: [
                  'Create meetings with title, description, date/time, and attendees',
                  'Set up meeting types (consultation, follow-up, team meeting, etc.)',
                  'Bot sends automatic reminders to all attendees',
                  'View all scheduled meetings in calendar view',
                  'Reschedule or cancel meetings easily',
                  'Track meeting attendance and notes'
                ],
                example: 'POST /api/bots/meeting-scheduler\n{\n  "title": "Client Consultation",\n  "startTime": "2024-01-20T10:00:00Z",\n  "endTime": "2024-01-20T11:00:00Z",\n  "attendees": ["client@example.com"],\n  "location": "Zoom"\n}'
              },
              'social-media-manager': {
                title: 'Social Media Manager Bot',
                description: 'Advanced social media management tool for creating, scheduling, and managing posts across multiple platforms.',
                useCase: 'Essential for social media managers, marketers, and businesses that manage multiple social media accounts and need to schedule content in advance.',
                tier: 'All Plans',
                howToUse: [
                  'Create posts for Instagram, Twitter, LinkedIn, TikTok, or YouTube',
                  'Add media (images, videos) and hashtags',
                  'Schedule posts for optimal posting times',
                  'View all posts in calendar view',
                  'Track post performance and engagement',
                  'Bulk schedule multiple posts at once'
                ],
                example: 'POST /api/bots/social-media-manager\n{\n  "platform": "instagram",\n  "content": "Check out our new product! #newproduct #innovation",\n  "mediaUrls": ["https://example.com/image.jpg"],\n  "scheduledAt": "2024-01-20T14:00:00Z",\n  "hashtags": ["newproduct", "innovation"]\n}'
              },
              'content-repurposing': {
                title: 'Content Repurposing Bot',
                description: 'Automatically transform one piece of content into multiple platform-specific formats. Save hours of manual work by repurposing blog posts, articles, videos, and more across Instagram, Twitter, LinkedIn, TikTok, YouTube, and Pinterest.',
                useCase: 'Perfect for content creators, marketers, and businesses that create content once but need to adapt it for multiple platforms. Maximize your content ROI by getting 5-6 platform variations from a single piece of content.',
                tier: 'All Plans',
                howToUse: [
                  'Paste your original content (blog post, article, video script, etc.)',
                  'Select the content type (blog-post, article, video-script, etc.)',
                  'Choose target platforms (Instagram, Twitter, LinkedIn, TikTok, YouTube, Pinterest)',
                  'Bot automatically formats content for each platform with appropriate hooks, CTAs, and hashtags',
                  'Copy and use the repurposed content directly on each platform',
                  'View repurposing history in your dashboard'
                ],
                example: 'POST /api/bots/content-repurposing\n{\n  "originalContent": "Your blog post content here...",\n  "contentType": "blog-post",\n  "targetPlatforms": ["instagram", "twitter", "linkedin", "tiktok", "youtube"]\n}'
              },
              'content-gap-analyzer': {
                title: 'Content Gap Analyzer Bot',
                description: 'Identify content opportunities your competitors are missing. Analyze competitor content strategies and discover gaps in your own content to find the perfect topics, formats, and angles that will help you stand out.',
                useCase: 'Essential for content creators, marketers, and businesses who want to stay ahead of the competition. Perfect for anyone struggling with "what to create next" - this bot tells you exactly what content opportunities exist.',
                tier: 'All Plans',
                howToUse: [
                  'Enter competitor topics (what they\'re covering)',
                  'Enter your existing topics (what you\'ve already covered)',
                  'Optionally add niche, target audience, and format preferences',
                  'Bot analyzes gaps and identifies missing topics',
                  'Get prioritized content suggestions with recommended formats and angles',
                  'Discover your unique advantages (topics you cover that competitors don\'t)',
                  'View analysis history to track your content strategy evolution'
                ],
                example: 'POST /api/bots/content-gap-analyzer\n{\n  "competitorTopics": ["How to start a business", "Marketing strategies"],\n  "yourTopics": ["Social media marketing"],\n  "niche": "Business",\n  "targetAudience": "Entrepreneurs"\n}'
              },
              'hashtag-research': {
                title: 'Hashtag Research Tool',
                description: 'Find trending hashtags in your niche, get personalized recommendations based on your content, and save hashtag sets for quick reuse. Research hashtags by platform and niche to maximize your reach and engagement.',
                useCase: 'Perfect for content creators who want to optimize their hashtag strategy. Save time researching hashtags and build a library of proven hashtag sets for different content types and platforms.',
                tier: 'All Plans',
                howToUse: [
                  'Select your platform (Instagram, Twitter, TikTok, LinkedIn, YouTube)',
                  'Enter your niche (optional - auto-detected from your content)',
                  'Paste your content to get personalized hashtag recommendations',
                  'View trending hashtags in your niche with reach and engagement data',
                  'Save hashtag sets for quick reuse in future posts',
                  'Manage and organize your saved hashtag sets'
                ],
                example: 'POST /api/hashtag-research\n{\n  "action": "research",\n  "platform": "instagram",\n  "niche": "fitness",\n  "content": "Your post content here..."\n}'
              },
              'content-templates': {
                title: 'Content Templates Tool',
                description: 'Save and reuse post templates to speed up your content creation. Create templates with placeholders, organize by category and platform, and quickly insert templates when creating new posts.',
                useCase: 'Ideal for creators who post similar content regularly or want to maintain consistent messaging. Perfect for product launches, weekly series, or any repetitive content format.',
                tier: 'All Plans',
                howToUse: [
                  'Create a new template with name, platform, and content',
                  'Use {variable} placeholders in templates for dynamic content',
                  'Organize templates by category (e.g., "Product Launch", "Weekly Tips")',
                  'Copy templates directly to clipboard when creating posts',
                  'Edit or delete templates as your content strategy evolves',
                  'Filter templates by platform or category'
                ],
                example: 'POST /api/content-templates\n{\n  "name": "Product Launch",\n  "platform": "instagram",\n  "content": "Excited to announce {product}! {description} #NewProduct",\n  "category": "Announcements"\n}'
              },
              'engagement-inbox': {
                title: 'Engagement Inbox Tool',
                description: 'Centralized inbox for managing all your social media engagement - comments, messages, mentions, and replies. Track engagement across all platforms in one place, mark as read/replied, and never miss important interactions.',
                useCase: 'Essential for creators who want to stay on top of audience engagement. Perfect for managing comments and messages across multiple platforms without switching between apps.',
                tier: 'All Plans',
                howToUse: [
                  'View all engagement in one unified inbox',
                  'Filter by platform, type (comment/message/mention), or status',
                  'Mark items as read, replied, or archived',
                  'Track unread count to stay on top of engagement',
                  'Manually add engagement items or integrate with social platforms',
                  'Organize and prioritize your audience interactions'
                ],
                example: 'POST /api/engagement-inbox\n{\n  "action": "add",\n  "platform": "instagram",\n  "type": "comment",\n  "content": "Great post!",\n  "author_name": "John Doe"\n}'
              },
              'content-assistant': {
                title: 'Content Assistant Bot',
                description: 'Real-time content analysis and optimization suggestions as you type your posts. Analyzes content quality, tone, brand consistency, and platform best practices.',
                useCase: 'Perfect for all content creators who want to improve their post quality before publishing. Get instant feedback on length, hashtags, tone, and engagement potential.',
                tier: 'All Plans',
                howToUse: [
                  'Navigate to Create Post page or use in dashboard',
                  'Type or paste your content',
                  'Select your platform (Instagram, Twitter, LinkedIn, etc.)',
                  'Bot analyzes in real-time and provides a content score (0-100)',
                  'Review suggestions: Green = Good, Yellow = Needs improvement, Red = Important fixes',
                  'Follow actionable recommendations to improve your content',
                  'Check word count, hashtag count, emoji usage, and platform-specific tips'
                ],
                example: 'POST /api/bots/content-assistant\n{\n  "content": "Your post content here",\n  "platform": "instagram"\n}'
              },
              'scheduling-assistant': {
                title: 'Scheduling Assistant Bot',
                description: 'AI-powered suggestions for optimal posting times based on your audience engagement patterns. Identifies best days and times to maximize engagement.',
                useCase: 'Ideal for creators who want to maximize engagement by posting at the right times. Perfect for planning your content calendar around optimal posting windows.',
                tier: 'All Plans',
                howToUse: [
                  'Navigate to Dashboard → AI Bots tab or Create Post page',
                  'Select your platform',
                  'View optimal times displayed by day and time slot with scores',
                  'Click a suggested time to auto-fill your schedule',
                  'Review recommendations: Best days of the week, peak engagement hours, platform-specific timing',
                  'Use insights to plan your weekly posting schedule',
                  'Bot learns from your historical engagement data'
                ],
                example: 'POST /api/bots/scheduling-assistant\n{\n  "platform": "instagram",\n  "timezone": "America/New_York"\n}'
              },
              'engagement-analyzer': {
                title: 'Engagement Analyzer Bot',
                description: 'Analyzes your past post performance to identify what content works best. Identifies trends, best performing content types, and optimal posting strategies.',
                useCase: 'Essential for creators who want to understand their audience and improve content strategy. Perfect for data-driven content creators who want to replicate success.',
                tier: 'All Plans',
                howToUse: [
                  'Navigate to Dashboard → AI Bots tab',
                  'Select your platform',
                  'View analysis of your recent posts: Average engagement rate, best performing posts, trends',
                  'Review insights: Best days, times, hashtags, content types',
                  'See recommendations for improving engagement',
                  'Use insights to create better content that resonates with your audience',
                  'Track performance patterns over time'
                ],
                example: 'POST /api/bots/engagement-analyzer\n{\n  "platform": "instagram",\n  "timeframe": "30days"\n}'
              },
              'trend-scout': {
                title: 'Trend Scout Bot',
                description: 'Identifies trending topics and viral opportunities in your niche. Monitors trending hashtags, emerging topics, and competitor content to help you stay current.',
                useCase: 'Perfect for creators who want to stay current and jump on trending topics. Ideal for maximizing reach by creating timely, relevant content.',
                tier: 'All Plans',
                howToUse: [
                  'Navigate to Dashboard → AI Bots tab',
                  'Select your platform and niche',
                  'View trending topics and hashtags with engagement data',
                  'Review opportunities and recommendations',
                  'See relevance scores for each trend',
                  'Create content based on trending topics',
                  'Check best time to post for trends to maximize visibility'
                ],
                example: 'POST /api/bots/trend-scout\n{\n  "platform": "instagram",\n  "niche": "fitness"\n}'
              },
              'content-curation': {
                title: 'Content Curation Bot',
                description: 'Suggests content ideas and identifies gaps in your content strategy. Analyzes your niche and provides personalized content recommendations.',
                useCase: 'Great for creators struggling with "what to create next" or wanting to diversify content. Perfect for maintaining a consistent content calendar with fresh ideas.',
                tier: 'All Plans',
                howToUse: [
                  'Navigate to Dashboard → AI Bots tab',
                  'Select your platform',
                  'View content ideas based on your niche and past content',
                  'Review content gaps (what you\'re missing in your strategy)',
                  'Get recommendations for next posts with descriptions and hashtags',
                  'See engagement potential estimates for each idea',
                  'Create content based on suggestions to fill gaps and diversify'
                ],
                example: 'POST /api/bots/content-curation\n{\n  "platform": "instagram",\n  "niche": "business"\n}'
              },
              'analytics-coach': {
                title: 'Analytics Coach Bot',
                description: 'Provides personalized growth insights and strategies based on your analytics. Explains metrics, suggests improvements, and predicts performance.',
                useCase: 'Ideal for creators who want actionable growth strategies, not just data. Perfect for understanding what metrics matter and how to improve them.',
                tier: 'All Plans',
                howToUse: [
                  'Navigate to Dashboard → AI Bots tab',
                  'Select your platform',
                  'View personalized insights: Growth metrics, trends, strategy recommendations',
                  'Review growth score (0-100) and what it means',
                  'See performance predictions based on current trends',
                  'Get actionable recommendations for each growth area',
                  'Implement suggested strategies and track improvements over time'
                ],
                example: 'POST /api/bots/analytics-coach\n{\n  "platform": "instagram",\n  "timeframe": "30days"\n}'
              }
            }

            const doc = botDocs[selectedBot]
            if (!doc) return null

            return (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBot(null)}>
                <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{doc.title}</h2>
                      <p className="text-sm text-gray-400 mt-1">{doc.tier}</p>
                    </div>
                    <button
                      onClick={() => setSelectedBot(null)}
                      className="text-gray-400 hover:text-white transition-colors text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">What is it?</h3>
                      <p className="text-gray-300">{doc.description}</p>
                    </div>

                    {/* Use Case */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Who is it for?</h3>
                      <p className="text-gray-300">{doc.useCase}</p>
                    </div>

                    {/* Simple UI Interface */}
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Use It Now</h3>
                      {selectedBot === 'expense-tracker' && (
                        <ExpenseTrackerUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'email-sorter' && (
                        <EmailSorterUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'content-writer' && (
                        <ContentWriterUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'invoice-generator' && (
                        <InvoiceGeneratorUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'customer-service' && (
                        <CustomerServiceUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'product-recommendation' && (
                        <ProductRecommendationUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'sales-lead-qualifier' && (
                        <SalesLeadQualifierUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'website-chat' && (
                        <WebsiteChatUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'meeting-scheduler' && (
                        <MeetingSchedulerUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'social-media-manager' && (
                        <SocialMediaManagerUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'content-repurposing' && (
                        <ContentRepurposingUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'content-gap-analyzer' && (
                        <ContentGapAnalyzerUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'hashtag-research' && (
                        <HashtagResearchUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'content-templates' && (
                        <ContentTemplatesUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                      {selectedBot === 'engagement-inbox' && (
                        <EngagementInboxUI token={token} onClose={() => setSelectedBot(null)} />
                      )}
                    </div>

                    {/* How to Use */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">How to Use</h3>
                      <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        {doc.howToUse.map((step, index) => (
                          <li key={index} className="pl-2">{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* API Endpoint (Collapsed) */}
                    <details className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <summary className="text-sm font-semibold text-blue-400 cursor-pointer">API Endpoint (Advanced)</summary>
                      <div className="mt-3">
                        <code className="text-xs text-blue-300 block mb-3">
                          /api/bots/{selectedBot}
                        </code>
                        {doc.example && (
                          <div className="mt-3">
                            <p className="text-xs text-blue-400 mb-2">Example Request:</p>
                            <pre className="text-xs text-blue-200 bg-gray-900/50 p-3 rounded overflow-x-auto">
                              {doc.example}
                            </pre>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`/api/bots/${selectedBot}`)
                            alert('API endpoint copied to clipboard!')
                          }}
                          className="mt-3 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs"
                        >
                          Copy API Endpoint
                        </button>
                      </div>
                    </details>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-700">
                      <button
                        onClick={() => setSelectedBot(null)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </main>
      </div>

      {/* Help Center Modal */}
      <HelpCenter isOpen={helpCenterOpen} onClose={() => setHelpCenterOpen(false)} />

      {/* Feedback Button */}
      <FeedbackButton token={token} />
    </div>
  )
}
