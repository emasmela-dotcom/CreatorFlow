import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const SUPPORT_TO = process.env.SUPPORT_TO_EMAIL || 'apputilitybuilder@gmail.com'
const DEFAULT_FROM = 'CreatorFlow365 Support <support@creatorflow365.com>'
const MAX_MESSAGE_LENGTH = 5000

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL || DEFAULT_FROM
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255
}

/**
 * Public (logged-out) feedback — emails support inbox via Resend.
 * Same error handling pattern as /api/support (no fake success).
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string
      message?: string
      rating?: number
    }
    const email = body.email?.trim().toLowerCase() ?? ''
    const message = body.message?.trim() ?? ''
    const rating = body.rating

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }
    if (message.length < 2) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
    }
    if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 })
    }

    const resend = getResend()
    if (!resend) {
      return NextResponse.json(
        {
          error:
            'Feedback mail is not set up on the server yet. Please try again later or email apputilitybuilder@gmail.com.',
        },
        { status: 503 }
      )
    }

    const from = getFromEmail()
    const safeMessage = message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    const ratingLine = rating ? `${rating}/5` : 'N/A'

    const sendResult = await resend.emails.send({
      from,
      to: SUPPORT_TO,
      replyTo: email,
      subject: `CreatorFlow365 Feedback: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="margin: 0 0 12px 0;">CreatorFlow365 Public Feedback</h2>
          <p style="margin: 0 0 8px 0;"><strong>From:</strong> ${email}</p>
          <p style="margin: 0 0 12px 0;"><strong>Rating:</strong> ${ratingLine}</p>
          <div style="white-space: pre-wrap; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">
            ${safeMessage}
          </div>
        </div>
      `,
    })

    if (sendResult.error) {
      console.error('Public feedback Resend error:', sendResult.error)
      return NextResponse.json(
        {
          error:
            sendResult.error.message ||
            'Could not send your feedback. Check Resend domain / from address setup.',
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, id: sendResult.data?.id })
  } catch (err) {
    console.error('Public feedback error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
