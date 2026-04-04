'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const supabase = createClient()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load submissions')
    } else {
      setSubmissions(data || [])
    }

    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error('Update failed')
    } else {
      toast.success('Status updated')
      fetchSubmissions()
    }
  }

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-sm">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{sub.title}</p>
                    <p className="text-sm text-slate-500">{sub.description}</p>
                  </td>

                  <td className="px-6 py-4">{sub.project_type}</td>

                  <td className="px-6 py-4">
                    {sub.budget ? `$${sub.budget}` : '-'}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${sub.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : sub.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {sub.status || 'pending'}
                    </span>
                  </td>

                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => updateStatus(sub.id, 'approved')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(sub.id, 'rejected')}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}