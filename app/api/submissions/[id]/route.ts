import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

type Params = {
  params: Promise<{ id: string }>
}

type UpdateStatusBody = {
  status?: 'pending' | 'approved' | 'rejected'
}

function isUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    if (!isUUID(id)) {
      return NextResponse.json({ error: 'Invalid submission id' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    const { data: submission, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    const isOwner = submission.user_id === user.id
    const isAdmin = profile.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ submission }, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    if (!isUUID(id)) {
      return NextResponse.json({ error: 'Invalid submission id' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    if (profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = (await req.json()) as UpdateStatusBody
    const status = body.status

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Submission status updated', submission: data },
      { status: 200 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}