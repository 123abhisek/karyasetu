'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  CheckCircle2,
  XCircle,
  Clock,
  FolderKanban,
  ExternalLink,
  X,
  RefreshCw,
  ChevronRight,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Link2,
  FileText,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────
type Status = 'pending' | 'approved' | 'rejected'

type Submission = {
  id: string
  title: string
  project_type: string
  description: string
  features_required: string | null
  tech_stack: string | null
  budget: number | null
  deadline: string | null
  phone: string | null
  email: string | null
  file_url: string | null
  reference_links: string | null
  additional_notes: string | null
  status: Status
  created_at: string
  users?: { name: string | null; email: string | null }
}

// ─── Status config ────────────────────────────────────────────
const STATUS_CFG: Record<Status, {
  label: string; bg: string; text: string; dot: string; border: string
}> = {
  pending:  { label: 'Pending',  bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400',  border: 'border-amber-100'  },
  approved: { label: 'Approved', bg: 'bg-emerald-50',  text: 'text-emerald-700',dot: 'bg-emerald-400',border: 'border-emerald-100' },
  rejected: { label: 'Rejected', bg: 'bg-red-50',      text: 'text-red-600',    dot: 'bg-red-400',    border: 'border-red-100'    },
}

const FILTERS: { value: Status | 'all'; label: string }[] = [
  { value: 'all',      label: 'All'      },
  { value: 'pending',  label: 'Pending'  },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

// ─── Skeleton row ─────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[40, 24, 20, 16, 24, 20].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className={`h-3.5 bg-slate-100 rounded w-${w}`} />
        </td>
      ))}
    </tr>
  )
}

// ─── Stat card ────────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, iconBg, iconColor, active, onClick,
}: {
  label: string; value: number; icon: React.ElementType
  iconBg: string; iconColor: string; active?: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all ${
        active ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-100'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
        <Icon size={17} className={iconColor} />
      </div>
      <p className="text-2xl font-black text-slate-900 leading-none mb-1">{value}</p>
      <p className="text-[12px] text-slate-500 font-medium">{label}</p>
    </button>
  )
}

// ─── Detail drawer ────────────────────────────────────────────
function DetailDrawer({
  sub,
  onClose,
  onStatusChange,
  updating,
}: {
  sub: Submission
  onClose: () => void
  onStatusChange: (id: string, status: Status) => void
  updating: boolean
}) {
  const cfg = STATUS_CFG[sub.status]

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-3 sticky top-0 bg-white z-10">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {sub.project_type}
            </p>
            <h3 className="text-[15px] font-bold text-slate-900 leading-tight">{sub.title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status + actions */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange(sub.id, 'approved')}
              disabled={updating || sub.status === 'approved'}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-[12px] font-bold hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {updating ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
              Approve
            </button>
            <button
              onClick={() => onStatusChange(sub.id, 'rejected')}
              disabled={updating || sub.status === 'rejected'}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-[12px] font-bold hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <XCircle size={12} />
              Reject
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 flex-1">

          {/* Description */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</p>
            <p className="text-[13px] text-slate-700 leading-relaxed">{sub.description || '—'}</p>
          </div>

          {/* Features */}
          {sub.features_required && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Features Required</p>
              <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">{sub.features_required}</p>
            </div>
          )}

          {/* Tech stack */}
          {sub.tech_stack && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {sub.tech_stack.split(',').map(t => (
                  <span key={t} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-semibold rounded-lg border border-indigo-100">
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Grid details */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: DollarSign, label: 'Budget',   value: sub.budget ? `$${sub.budget.toLocaleString()}` : '—' },
              { icon: Calendar,   label: 'Deadline',  value: sub.deadline ? new Date(sub.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
              { icon: User,       label: 'Contact',   value: sub.users?.name || '—' },
              { icon: Mail,       label: 'Email',     value: sub.email || sub.users?.email || '—' },
              { icon: Phone,      label: 'Phone',     value: sub.phone || '—' },
              { icon: Calendar,   label: 'Submitted', value: new Date(sub.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={11} className="text-slate-400" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                </div>
                <p className="text-[12px] font-semibold text-slate-800 truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Reference links */}
          {sub.reference_links && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Reference Links</p>
              <div className="space-y-1.5">
                {sub.reference_links.split(',').map(link => (
                  <a
                    key={link}
                    href={link.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[12px] text-indigo-600 hover:text-indigo-800 hover:underline truncate"
                  >
                    <Link2 size={11} className="shrink-0" />
                    {link.trim()}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* File */}
          {sub.file_url && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Attached File</p>
              <a
                href={sub.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 hover:bg-indigo-100 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                  <FileText size={15} className="text-indigo-600" />
                </div>
                <span className="text-[12px] font-semibold text-indigo-800 truncate flex-1">View Attachment</span>
                <ExternalLink size={13} className="text-indigo-400 shrink-0" />
              </a>
            </div>
          )}

          {/* Notes */}
          {sub.additional_notes && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Additional Notes</p>
              <p className="text-[13px] text-slate-700 leading-relaxed">{sub.additional_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────
export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filter, setFilter]           = useState<Status | 'all'>('all')
  const [loading, setLoading]         = useState(true)
  const [refreshing, setRefreshing]   = useState(false)
  const [selected, setSelected]       = useState<Submission | null>(null)
  const [updating, setUpdating]       = useState(false)

  const fetchSubmissions = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)

    try {
      const res = await fetch('/api/submissions')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setSubmissions(json.submissions ?? [])
    } catch {
      toast.error('Failed to load submissions')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])

  const updateStatus = async (id: string, status: Status) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      toast.success(`Submission ${status}`)
      // Optimistic update — no full refetch needed
      setSubmissions(prev =>
        prev.map(s => s.id === id ? { ...s, status } : s)
      )
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  // Derived stats
  const stats = {
    total:    submissions.length,
    pending:  submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  }

  const filtered = filter === 'all'
    ? submissions
    : submissions.filter(s => s.status === filter)

  return (
    <div className="space-y-6 max-w-7xl">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Submissions</h2>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Review, approve or reject student project requests
          </p>
        </div>
        <button
          onClick={() => fetchSubmissions(true)}
          disabled={refreshing}
          aria-label="Refresh"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Stats cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total"    value={stats.total}    icon={FolderKanban} iconBg="bg-indigo-50"  iconColor="text-indigo-600"  active={filter === 'all'}      onClick={() => setFilter('all')} />
        <StatCard label="Pending"  value={stats.pending}  icon={Clock}        iconBg="bg-amber-50"   iconColor="text-amber-600"   active={filter === 'pending'}  onClick={() => setFilter('pending')} />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-600" active={filter === 'approved'} onClick={() => setFilter('approved')} />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle}      iconBg="bg-red-50"     iconColor="text-red-500"     active={filter === 'rejected'} onClick={() => setFilter('rejected')} />
      </div>

      {/* ── Table card ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Table toolbar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-4">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {FILTERS.map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  filter === f.value
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f.label}
                <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  filter === f.value ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'
                }`}>
                  {f.value === 'all' ? stats.total
                    : f.value === 'pending'  ? stats.pending
                    : f.value === 'approved' ? stats.approved
                    : stats.rejected}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <SlidersHorizontal size={12} />
            Click a row to view details
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">Project</th>
                <th className="px-5 py-3">Submitted by</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Budget</th>
                <th className="px-5 py-3">Deadline</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <FolderKanban size={20} className="text-slate-400" />
                      </div>
                      <p className="text-[13px] font-semibold text-slate-600">No submissions found</p>
                      <p className="text-[11px] text-slate-400">
                        {filter === 'all' ? 'No submissions yet.' : `No ${filter} submissions.`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(sub => {
                  const cfg = STATUS_CFG[sub.status]
                  return (
                    <tr
                      key={sub.id}
                      onClick={() => setSelected(sub)}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                    >
                      {/* Project */}
                      <td className="px-5 py-3.5 max-w-[200px]">
                        <p className="text-[13px] font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                          {sub.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {sub.description?.slice(0, 48)}…
                        </p>
                      </td>

                      {/* Submitted by */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 shrink-0">
                            {(sub.users?.name ?? sub.email ?? '?')[0].toUpperCase()}
                          </div>
                          <span className="text-[12px] text-slate-600 truncate max-w-[100px]">
                            {sub.users?.name ?? sub.email ?? '—'}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] text-slate-500">{sub.project_type}</span>
                      </td>

                      {/* Budget */}
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] font-semibold text-slate-700">
                          {sub.budget ? `$${sub.budget.toLocaleString()}` : '—'}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] text-slate-500">
                          {sub.deadline
                            ? new Date(sub.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                            : '—'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => updateStatus(sub.id, 'approved')}
                            disabled={updating || sub.status === 'approved'}
                            title="Approve"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                          <button
                            onClick={() => updateStatus(sub.id, 'rejected')}
                            disabled={updating || sub.status === 'rejected'}
                            title="Reject"
                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <XCircle size={14} />
                          </button>
                          <button
                            onClick={() => setSelected(sub)}
                            title="View details"
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{' '}
              <span className="font-semibold text-slate-600">{stats.total}</span> submissions
            </p>
          </div>
        )}
      </div>

      {/* ── Detail drawer ────────────────────────────── */}
      {selected && (
        <DetailDrawer
          sub={selected}
          onClose={() => setSelected(null)}
          onStatusChange={updateStatus}
          updating={updating}
        />
      )}
    </div>
  )
}