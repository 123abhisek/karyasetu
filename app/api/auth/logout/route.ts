import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}