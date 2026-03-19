import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { verifyAuth } from '@/lib/auth'

const DEFAULT_TO_EMAIL = 'support@creatorflow365.com'
const DEFAULT_FROM_EMAIL = 'CreatorFlow365 <support@creatorflow365.com>'

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL
}

function getToEmail() {
  return process.env.RESEND_SUGGESTIONS_TO_EMAIL || DEFAULT_TO_EMAIL
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await verifyAuth(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const suggestionType =
      typeof body?.suggestionType === 'string' ? body.suggestionType : 'add_on'
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    const validTypes = new Set(['add_on', 'change', 'concern'])
    if (!validTypes.has(suggestionType)) {
      return NextResponse.json({ error: 'Invalid suggestionType' }, { status: 400 })
    }
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long (max 5000 chars)' }, { status: 400 })
    }

    const resend = getResend()
    if (!resend) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured (Vercel env var)' },
        { status: 500 }
      )
    }

    const toEmail = getToEmail()
    const subject = `CreatorFlow365 Suggestion: ${suggestionType}`

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="margin: 0 0 12px 0;">CreatorFlow365 Suggestion</h2>
        <p style="margin: 0 0 12px 0;">
          <strong>Type:</strong> ${suggestionType}<br/>
          <strong>User:</strong> ${authUser.email} (${authUser.userId})<br/>
        </p>
        <div style="white-space: pre-wrap; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">
          ${message}
        </div>
        <p style="margin-top: 14px; color: #6b7280; font-size: 12px;">
          Sent just now from the CreatorFlow365 dashboard.
        </p>
      </div>
    `

    await resend.emails.send({
      from: getFromEmail(),
      to: toEmail,
      subject,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Suggestion email error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to send suggestion email' }, { status: 500 })
  }
}

