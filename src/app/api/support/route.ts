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
 * Public support form — emails apputilitybuilder@gmail.com via Resend.
 * Optional confirmation email back to the user.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; message?: string }
    const email = body.email?.trim().toLowerCase() ?? ''
    const message = body.message?.trim() ?? ''

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }
    if (message.length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters.' }, { status: 400 })
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
    }

    const resend = getResend()
    if (!resend) {
      return NextResponse.json(
        {
          error:
            'Support mail is not set up on the server yet. Please try again later or email apputilitybuilder@gmail.com.',
        },
        { status: 503 }
      )
    }

    const from = getFromEmail()
    const safeMessage = message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    const supportSend = await resend.emails.send({
      from,
      to: SUPPORT_TO,
      replyTo: email,
      subject: `CreatorFlow365 Support: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="margin: 0 0 12px 0;">CreatorFlow365 Support Message</h2>
          <p style="margin: 0 0 12px 0;"><strong>From:</strong> ${email}</p>
          <div style="white-space: pre-wrap; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">
            ${safeMessage}
          </div>
        </div>
      `,
    })

    if (supportSend.error) {
      console.error('Support email Resend error:', supportSend.error)
      return NextResponse.json(
        {
          error:
            supportSend.error.message ||
            'Could not send your message. Check Resend domain / from address setup.',
        },
        { status: 502 }
      )
    }

    let confirmationSent = false
    const confirmSend = await resend.emails.send({
      from,
      to: email,
      subject: 'We received your CreatorFlow365 support message',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <p>Thanks for contacting CreatorFlow365 support.</p>
          <p>We received your message and will reply to this email address.</p>
          <p style="color:#6b7280;font-size:12px;">If you need to follow up, reply to this email thread.</p>
        </div>
      `,
    })

    if (confirmSend.error) {
      console.error('Support confirmation Resend error:', confirmSend.error)
    } else {
      confirmationSent = true
    }

    return NextResponse.json({
      ok: true,
      confirmationSent,
      id: supportSend.data?.id ?? null,
    })
  } catch (error: unknown) {
    console.error('Support route error:', error)
    return NextResponse.json({ error: 'Could not send your message.' }, { status: 500 })
  }
}
