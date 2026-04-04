'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, LogOut } from 'lucide-react'

// The "export default function" part is strictly required by Next.js
export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      // Call the API route we created for secure cookie clearing
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/submit', label: 'Submit Project', icon: PlusCircle },
  ]

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6">
        <h1 className="text-2xl font-black text-indigo-950 mb-10">Karyasetu.</h1>
        
        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                  active 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <link.icon size={20} className={active ? 'text-indigo-600' : 'text-slate-400'} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 text-slate-600 font-medium hover:bg-red-50 hover:text-red-600 rounded-xl transition mt-auto"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content Area where page.tsx renders */}
      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  )
}