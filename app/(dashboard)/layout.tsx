'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Bell,
  Search,
  User,
  FolderKanban,
  ChevronRight,
  Settings,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

type UserProfile = {
  name: string
  email: string
  role: string
}

const NAV_LINKS = [
  { href: '/dashboard',   label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/submit',      label: 'Submit Project', icon: PlusCircle      },
  { href: '/submissions', label: 'My Projects',    icon: FolderKanban    },
  { href: '/profile',     label: 'Profile',        icon: User            },
  { href: '/settings',    label: 'Settings',       icon: Settings        },
]

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':   'Dashboard',
  '/submit':      'Submit a Project',
  '/submissions': 'My Projects',
  '/profile':     'My Profile',
  '/settings':    'Settings',
  '/admin':       'Admin Panel',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router   = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const [user, setUser]         = useState<UserProfile | null>(null)
  const [initials, setInitials] = useState('U')

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data } = await supabase
        .from('users')
        .select('name, email, role')
        .eq('id', authUser.id)
        .single()

      if (data) {
        setUser(data)
        const parts = (data.name ?? '').trim().split(' ')
        setInitials(
          parts.length >= 2
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : (parts[0]?.[0] ?? 'U').toUpperCase()
        )
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      router.push('/login')
    }
  }

  const currentTitle = PAGE_TITLES[pathname] ?? 'Karyasetu'

  return (
    <div className="flex h-screen bg-[#f5f6fa] overflow-hidden">

      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside className="w-[240px] shrink-0 bg-[#1e1b4b] flex flex-col h-full">

        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/40">
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-base font-black text-white tracking-tight leading-none">Karyasetu.</p>
              <p className="text-[10px] text-indigo-400 font-medium mt-0.5">Work Bridge</p>
            </div>
          </div>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-6 pb-2">
          <p className="text-[9px] font-bold tracking-[0.15em] text-indigo-400/70 uppercase">Main Menu</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                    : 'text-indigo-200/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={17} className={`shrink-0 transition-colors ${active ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-200'}`} />
                <span className="flex-1">{label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-white/70 shrink-0" />}
              </Link>
            )
          })}

          {/* Admin section — only visible to admins */}
          {user?.role === 'admin' && (
            <>
              <div className="px-3.5 pt-5 pb-2">
                <p className="text-[9px] font-bold tracking-[0.15em] text-indigo-400/70 uppercase">Admin</p>
              </div>
              <Link
                href="/admin"
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  pathname === '/admin'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                    : 'text-indigo-200/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ChevronRight size={17} className="shrink-0 text-indigo-400 group-hover:text-indigo-200" />
                Admin Panel
              </Link>
            </>
          )}
        </nav>

        {/* Support card */}
        <div className="mx-3 mb-3 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/80 to-purple-600/80 border border-white/10">
          <p className="text-xs font-bold text-white mb-0.5">Need help?</p>
          <p className="text-[11px] text-indigo-100/80 leading-snug mb-3">
            Our team is here to guide you through every step.
          </p>
          <a
            href="mailto:support@karyasetu.com"
            className="block text-center text-[11px] font-semibold bg-white text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
          >
            Contact Support
          </a>
        </div>

        {/* User profile + logout */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-md">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate leading-tight">{user?.name ?? '—'}</p>
              <p className="text-[10px] text-indigo-400 truncate mt-0.5">
                {user?.role === 'admin' ? '🔑 Admin' : '👤 Student'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="shrink-0 p-1.5 rounded-lg text-indigo-400 hover:text-red-400 hover:bg-white/10 transition"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ───────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header className="h-[60px] bg-white border-b border-slate-100 px-7 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-[15px] font-bold text-slate-900 leading-tight">{currentTitle}</h1>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                aria-label="Search"
                className="pl-9 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48 placeholder:text-slate-400 transition"
              />
            </div>
            <button aria-label="Notifications" className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition">
              <Bell size={16} className="text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-[1.5px] ring-white" aria-hidden="true" />
            </button>
            <button aria-label="User menu" className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm hover:shadow-md transition">
              {initials}
            </button>
          </div>
        </header>

        {/* ✅ THIS is the only place {children} renders — no wrapping in pages */}
        <main className="flex-1 overflow-y-auto p-7 bg-[#f5f6fa]">
          {children}
        </main>
      </div>
    </div>
  )
}