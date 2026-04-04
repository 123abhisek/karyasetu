import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

type LoginBody = {
  email?: string
  password?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginBody
    const email = body.email?.trim().toLowerCase() || ''
    const password = body.password || ''

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id, name, email, role, phone, created_at')
      .eq('id', data.user.id)
      .single()

    return NextResponse.json(
      {
        message: 'Login successful',
        user: profile ?? {
          id: data.user.id,
          email: data.user.email,
        },
        session: data.session,
      },
      { status: 200 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}