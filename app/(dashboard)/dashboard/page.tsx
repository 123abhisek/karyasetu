'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import Link from 'next/link'
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  FolderKanban,
  ArrowRight,
  TrendingUp,
  Calendar,
  ExternalLink,
} from 'lucide-react'

type Submission = {
  id: string
  title: string
  project_type: string
  status: 'pending' | 'approved' | 'rejected'
  budget: number | null
  deadline: string | null
  created_at: string
}

type Stats = {
  total: number
  pending: number
  approved: number
  rejected: number
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
    border: 'border-amber-100',
  },
  approved: {
    label: 'Approved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-400',
    border: 'border-emerald-100',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-400',
    border: 'border-red-100',
  },
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
}: {
  label: string
  value: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
  trend?: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon size={18} className={iconColor} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <TrendingUp size={10} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-slate-900 leading-none mb-1">
        {value}
      </p>
      <p className="text-[12px] text-slate-500 font-medium">{label}</p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-slate-100 mb-4" />
      <div className="h-7 w-12 bg-slate-100 rounded-lg mb-2" />
      <div className="h-3 w-24 bg-slate-100 rounded" />
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="h-4 w-40 bg-slate-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-5 w-16 bg-slate-100 rounded-full" /></td>
      <td className="px-5 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
    </tr>
  )
}

export default function DashboardPage() {
  const supabase = createClient()

  const [userName, setUserName]     = useState('')
  const [stats, setStats]           = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single()

      if (profile) setUserName(profile.name?.split(' ')[0] ?? '')

      // Fetch submissions
      const { data: subs } = await supabase
        .from('submissions')
        .select('id, title, project_type, status, budget, deadline, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6)

      if (subs) {
        setSubmissions(subs)
        setStats({
          total:    subs.length,
          pending:  subs.filter(s => s.status === 'pending').length,
          approved: subs.filter(s => s.status === 'approved').length,
          rejected: subs.filter(s => s.status === 'rejected').length,
        })
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const greetingHour = new Date().getHours()
  const greeting =
    greetingHour < 12 ? 'Good morning' :
    greetingHour < 17 ? 'Good afternoon' :
    'Good evening'

  return (
    <div className="space-y-7 max-w-6xl">

      {/* ── Welcome Banner ──────────────────────────── */}
      <div className="bg-[#1e1b4b] rounded-2xl px-7 py-6 flex items-center justify-between overflow-hidden relative">
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 w-64 h-full opacity-10"
          style={{ background: 'radial-gradient(ellipse at right, #818cf8, transparent 70%)' }}
        />
        <div>
          <p className="text-indigo-300 text-xs font-semibold mb-1 uppercase tracking-widest">
            {greeting}
          </p>
          <h2 className="text-2xl font-black text-white mb-1">
            {loading ? 'Welcome back 👋' : `Welcome back, ${userName || 'there'} 👋`}
          </h2>
          <p className="text-indigo-300 text-sm">
            Track your submissions and manage your project pipeline.
          </p>
        </div>
        <Link
          href="/submit"
          className="hidden sm:flex items-center gap-2 bg-white text-indigo-700 text-sm font-bold px-5 py-3 rounded-xl hover:bg-indigo-50 transition shadow-lg shrink-0"
        >
          <PlusCircle size={16} />
          New Project
        </Link>
      </div>

      {/* ── Stats Cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Submissions"
              value={stats.total}
              icon={FolderKanban}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
              trend="+12%"
            />
            <StatCard
              label="Pending Review"
              value={stats.pending}
              icon={Clock}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
            />
            <StatCard
              label="Approved"
              value={stats.approved}
              icon={CheckCircle2}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <StatCard
              label="Rejected"
              value={stats.rejected}
              icon={XCircle}
              iconBg="bg-red-50"
              iconColor="text-red-500"
            />
          </>
        )}
      </div>

      {/* ── Bottom Grid: Table + Quick Actions ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Submissions Table — takes 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-bold text-slate-900">Recent Submissions</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Your last 6 project requests</p>
            </div>
            <Link
              href="/submissions"
              className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <table className="w-full">
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          ) : submissions.length === 0 ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <FolderKanban size={22} className="text-indigo-400" />
              </div>
              <p className="text-[13px] font-semibold text-slate-700 mb-1">No submissions yet</p>
              <p className="text-[12px] text-slate-400 max-w-[22ch] mb-5 leading-snug">
                Submit your first project to get started.
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center gap-1.5 text-[12px] font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
              >
                <PlusCircle size={13} /> Submit a Project
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    <th className="px-5 py-3">Project</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Budget</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {submissions.map((sub) => {
                    const cfg = STATUS_CONFIG[sub.status]
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="text-[13px] font-semibold text-slate-800 truncate max-w-[160px]">
                            {sub.title}
                          </p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[12px] text-slate-500">{sub.project_type}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[12px] font-medium text-slate-700">
                            {sub.budget ? `$${sub.budget.toLocaleString()}` : '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[12px] text-slate-400">
                            {new Date(sub.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                            })}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column — Quick Actions + Status Guide */}
        <div className="flex flex-col gap-4">

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              <Link
                href="/submit"
                className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                  <PlusCircle size={15} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-indigo-900">Submit Project</p>
                  <p className="text-[10px] text-indigo-400">Start a new request</p>
                </div>
                <ArrowRight size={14} className="text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/submissions"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                  <FolderKanban size={15} className="text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-slate-800">View All Projects</p>
                  <p className="text-[10px] text-slate-400">See full history</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                  <ExternalLink size={15} className="text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-slate-800">Edit Profile</p>
                  <p className="text-[10px] text-slate-400">Update your info</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Status Guide Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-slate-900 mb-1">Status Guide</h3>
            <p className="text-[11px] text-slate-400 mb-4">How your submissions move through review</p>
            <div className="space-y-3">
              {[
                {
                  status: 'pending',
                  desc: 'Submitted, awaiting admin review.',
                },
                {
                  status: 'approved',
                  desc: 'Approved and being actioned.',
                },
                {
                  status: 'rejected',
                  desc: 'Needs revision or re-submission.',
                },
              ].map(({ status, desc }) => {
                const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
                return (
                  <div key={status} className="flex items-start gap-3">
                    <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                    <div>
                      <p className={`text-[11px] font-bold ${cfg.text}`}>{cfg.label}</p>
                      <p className="text-[10px] text-slate-400 leading-snug">{desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Next Deadline Card */}
          {!loading && submissions.some(s => s.deadline) && (
            <div className="bg-[#1e1b4b] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} className="text-indigo-300" />
                <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">Nearest Deadline</p>
              </div>
              {(() => {
                const next = submissions
                  .filter(s => s.deadline)
                  .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())[0]
                return next ? (
                  <>
                    <p className="text-[13px] font-bold text-white truncate mb-1">{next.title}</p>
                    <p className="text-[12px] text-indigo-300">
                      {new Date(next.deadline!).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </>
                ) : null
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}