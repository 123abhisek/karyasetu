import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'

type SignupBody = {
  name?: string
  email?: string
  password?: string
  phone?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SignupBody
    const name = body.name?.trim() || ''
    const email = body.email?.trim().toLowerCase() || ''
    const password = body.password || ''
    const phone = body.phone?.trim() || ''

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role: 'user',
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const user = data.user

    if (!user) {
      return NextResponse.json(
        { error: 'Signup failed. No user returned.' },
        { status: 400 }
      )
    }

    const { error: profileError } = await adminSupabase.from('users').upsert(
      {
        id: user.id,
        name,
        email,
        phone,
        role: 'user',
      },
      { onConflict: 'id' }
    )

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Signup successful',
        user: {
          id: user.id,
          email: user.email,
        },
        session: data.session,
      },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}