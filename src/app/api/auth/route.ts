import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const dynamic = 'force-static'

export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json()

    if (action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      // Send confirmation email
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'Welcome to CreatorFlow!',
          html: '<p>Welcome to CreatorFlow! Your account has been created successfully.</p>'
        });
        console.log('Signup successful, email sent to:', email);
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
      }

      return NextResponse.json({ 
        message: 'Account created successfully',
        user: data.user 
      })
    }

    if (action === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ 
        message: 'Signed in successfully',
        user: data.user 
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
