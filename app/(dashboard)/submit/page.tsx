'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SubmitPage() {
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    project_type: 'Web App',
    description: '',
    budget: '',
    deadline: '',
  })

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Please login first')

      let file_url = null

      // ✅ Upload file
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('project_files')
          .upload(`${user.id}/${fileName}`, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('project_files')
          .getPublicUrl(`${user.id}/${fileName}`)

        file_url = data.publicUrl
      }

      // ✅ Insert data
      const { error } = await supabase.from('submissions').insert([
        {
          user_id: user.id,
          title: formData.title,
          project_type: formData.project_type,
          description: formData.description,
          budget: formData.budget ? Number(formData.budget) : null,
          deadline: formData.deadline || null,
          file_url,
        },
      ])

      if (error) throw error

      toast.success('Project submitted successfully!')
      router.push('/dashboard')

    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Submit New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          required
          type="text"
          name="title"
          placeholder="Project Title"
          onChange={handleChange}
          className="w-full p-3 bg-slate-100 rounded"
        />

        <select
          name="project_type"
          onChange={handleChange}
          className="w-full p-3 bg-slate-100 rounded"
        >
          <option>Web App</option>
          <option>Mobile App</option>
          <option>AI/ML Project</option>
        </select>

        <textarea
          required
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full p-3 bg-slate-100 rounded"
        />

        <input
          type="number"
          name="budget"
          placeholder="Budget"
          onChange={handleChange}
          className="w-full p-3 bg-slate-100 rounded"
        />

        <input
          type="date"
          name="deadline"
          onChange={handleChange}
          className="w-full p-3 bg-slate-100 rounded"
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

      </form>
    </div>
  )
}