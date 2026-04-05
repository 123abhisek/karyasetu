'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  ArrowRight, Briefcase, CheckCircle2,
  Eye, EyeOff, Loader2, Lock, Mail, User, Zap,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Matching',
    desc: 'Get matched with expert builders in hours, not weeks.',
  },
  {
    icon: Briefcase,
    title: 'Track Everything',
    desc: 'Monitor your project status from submission to delivery.',
  },
  {
    icon: CheckCircle2,
    title: 'Admin Reviewed',
    desc: 'Every submission is reviewed and approved by our team.',
  },
]

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)
        toast.success('Welcome back!')
        router.push('/dashboard')
      } else {
        if (!form.name.trim()) throw new Error('Full name is required')
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)
        toast.success('Account created! Welcome to Karyasetu.')
        router.push('/dashboard')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">

      {/* ─── LEFT BRAND PANEL ──────────────────────────────── */}
      <div className="hidden lg:flex w-[52%] bg-[#1e1b4b] flex-col justify-between p-12 relative overflow-hidden">

        {/* Ambient radial glow — subtle, not decorative blob */}
        <div
          aria-hidden="true"
          className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }}
        />

        {/* Logo */}
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
                <path
                  d="M4 10h12M10 4l6 6-6 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">Karyasetu.</span>
          </div>
          <p className="text-indigo-300 text-sm font-medium pl-10">Work Bridge</p>
        </div>

        {/* Hero Copy */}
        <div className="flex-1 flex flex-col justify-center max-w-md">
          <p className="text-indigo-300 text-xs font-bold tracking-widest uppercase mb-4">
            Student Project Platform
          </p>
          <h1 className="text-4xl font-black text-white leading-tight mb-5">
            Bridge the gap between ideas and execution.
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed mb-10">
            Submit your project requirements, get expert builders assigned, and
            track every stage from idea to delivery — all in one place.
          </p>

          {/* Feature cards — inspired by Mindset Health floating cards (file:1) */}
          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4"
              >
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-indigo-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-snug">{title}</p>
                  <p className="text-xs text-indigo-300 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof footer */}
        <div className="flex items-center gap-4 border-t border-white/10 pt-6">
          <div className="flex -space-x-2.5">
            {['AK', 'RS', 'PM', 'NJ'].map((initials) => (
              <div
                key={initials}
                className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-[#1e1b4b] flex items-center justify-center text-[10px] font-bold text-white"
              >
                {initials}
              </div>
            ))}
          </div>
          <p className="text-indigo-300 text-xs leading-snug">
            <span className="text-white font-semibold">200+ students</span>{' '}
            have submitted projects this month
          </p>
        </div>
      </div>

      {/* ─── RIGHT FORM PANEL ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-12 bg-slate-50">

        {/* Mobile-only logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-[#1e1b4b] flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
              <path
                d="M4 10h12M10 4l6 6-6 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl font-black text-slate-900">Karyasetu.</span>
        </div>

        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="text-sm text-slate-500">
              {isLogin
                ? 'Enter your credentials to continue.'
                : 'Start submitting projects in minutes.'}
            </p>
          </div>

          {/* Login / Sign Up tab toggle */}
          <div className="flex bg-slate-200 rounded-xl p-1 mb-7 gap-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isLogin
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                !isLogin
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4" noValidate>

            {/* Name — Sign Up only */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={!isLogin}
                    placeholder="Abhishek Juvatkar"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-600 uppercase tracking-wide"
                >
                  Password
                </label>
                {isLogin && (
                  <a href="#" className="text-xs text-indigo-600 font-medium hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  placeholder={isLogin ? 'Enter your password' : 'Min. 6 characters'}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-0.5"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-[11px] text-slate-400 mt-1.5 pl-0.5">
                  Must be at least 6 characters long.
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-[#1e1b4b] text-white rounded-xl text-sm font-semibold hover:bg-indigo-900 active:scale-[0.98] transition-all duration-150 shadow-md shadow-indigo-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <p className="text-xs text-slate-400 font-medium">OR</p>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Inline toggle (secondary) */}
          <p className="text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setForm({ name: '', email: '', password: '' })
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? 'Create one free' : 'Sign in instead'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-slate-400 text-center max-w-xs">
          By continuing, you agree to Karyasetu&apos;s{' '}
          <a href="#" className="underline hover:text-slate-600">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}