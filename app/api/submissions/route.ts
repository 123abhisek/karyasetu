import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

type SubmissionBody = {
  title?: string
  project_type?: string
  description?: string
  features_required?: string
  tech_stack?: string
  budget?: number | string | null
  deadline?: string | null
  phone?: string
  email?: string
  file_url?: string
  reference_links?: string
  additional_notes?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function GET() {
  try {
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

    let query = supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (profile.role !== 'admin') {
      query = query.eq('user_id', user.id)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ submissions: data }, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as SubmissionBody

    const title = body.title?.trim() || ''
    const project_type = body.project_type?.trim() || ''
    const description = body.description?.trim() || ''
    const features_required = body.features_required?.trim() || ''
    const tech_stack = body.tech_stack?.trim() || ''
    const phone = body.phone?.trim() || ''
    const email = body.email?.trim().toLowerCase() || ''
    const file_url = body.file_url?.trim() || ''
    const reference_links = body.reference_links?.trim() || ''
    const additional_notes = body.additional_notes?.trim() || ''

    if (!title || !project_type || !description) {
      return NextResponse.json(
        { error: 'Title, project type, and description are required' },
        { status: 400 }
      )
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid contact email address' },
        { status: 400 }
      )
    }

    const budget =
      body.budget === null || body.budget === undefined || body.budget === ''
        ? null
        : Number(body.budget)

    if (budget !== null && Number.isNaN(budget)) {
      return NextResponse.json(
        { error: 'Budget must be a valid number' },
        { status: 400 }
      )
    }

    const deadline =
      body.deadline && body.deadline.trim() !== '' ? body.deadline : null

    const { data, error } = await supabase
      .from('submissions')
      .insert({
        user_id: user.id,
        title,
        project_type,
        description,
        features_required,
        tech_stack,
        budget,
        deadline,
        phone,
        email,
        file_url,
        reference_links,
        additional_notes,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Submission created successfully', submission: data },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}