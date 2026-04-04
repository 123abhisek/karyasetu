import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/zip',
  'application/x-zip-compressed',
  'image/png',
  'image/jpeg',
  'image/jpg',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, '-')
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

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be 10MB or less' },
        { status: 400 }
      )
    }

    const safeName = sanitizeFileName(file.name)
    const filePath = `${user.id}/${Date.now()}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('project_files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 400 }
      )
    }

    const { data } = supabase.storage.from('project_files').getPublicUrl(filePath)

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        file_url: data.publicUrl,
        file_path: filePath,
      },
      { status: 200 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}