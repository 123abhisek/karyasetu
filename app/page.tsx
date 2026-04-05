import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FolderKanban,
  Zap,
  ShieldCheck,
  Users,
  Star,
  ChevronDown,
  Briefcase,
  Code2,
  Cpu,
  Globe,
  MessageSquare,
  TrendingUp,
  BarChart3,
} from 'lucide-react'

// ─── Nav ──────────────────────────────────────────────────────
function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1e1b4b] flex items-center justify-center shadow-md">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">Karyasetu.</span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-7">
          {['Features', 'How It Works', 'Testimonials', 'FAQ'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="hidden sm:block text-[13px] font-semibold text-slate-700 hover:text-slate-900 transition px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 bg-[#1e1b4b] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-900 transition shadow-md shadow-indigo-900/20"
          >
            Get Started
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-32 pb-24 px-6 bg-[#f8f7ff] relative overflow-hidden">
      {/* Background decoration */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-100/60 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 rounded-full px-4 py-1.5 mb-7 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[12px] font-bold text-indigo-700 uppercase tracking-widest">
            Student Project Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
          Bridge the gap between{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            ideas
          </span>{' '}
          and execution.
        </h1>

        {/* Subtext */}
        <p className="text-[clamp(1rem,2vw,1.2rem)] text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">
          Submit your project requirements, get expert builders assigned, and
          track every stage from idea to delivery — all in one place. Built for
          students, designed for results.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            href="/login"
            className="flex items-center gap-2 bg-[#1e1b4b] text-white text-[15px] font-bold px-8 py-4 rounded-2xl hover:bg-indigo-900 transition shadow-xl shadow-indigo-900/25 w-full sm:w-auto justify-center"
          >
            Submit Your Project
            <ArrowRight size={17} />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 bg-white text-slate-700 text-[15px] font-semibold px-8 py-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition w-full sm:w-auto justify-center"
          >
            See How It Works
          </a>
        </div>

        {/* Social proof avatars */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex -space-x-3">
            {['AK', 'RS', 'PM', 'NJ', 'VK'].map((name, i) => (
              <div
                key={name}
                className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                style={{
                  background: ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b'][i],
                  zIndex: 5 - i,
                }}
              >
                {name}
              </div>
            ))}
          </div>
          <p className="text-[13px] text-slate-500">
            <span className="font-bold text-slate-800">200+ students</span>{' '}
            submitted projects this month
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 animate-bounce">
        <ChevronDown size={20} />
      </div>
    </section>
  )
}

// ─── Stats bar ────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: '200+',  label: 'Projects Submitted' },
    { value: '95%',   label: 'Approval Rate'       },
    { value: '24h',   label: 'Average Review Time' },
    { value: '50+',   label: 'Expert Builders'     },
  ]

  return (
    <section className="bg-[#1e1b4b] py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-3xl font-black text-white mb-1">{value}</p>
            <p className="text-[12px] text-indigo-300 font-medium">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Briefcase,
      title: 'Submit Your Project',
      desc: 'Fill in your project details — title, description, budget, deadline, and any reference files. Our structured form makes it fast.',
      color: 'bg-indigo-600',
    },
    {
      number: '02',
      icon: Users,
      title: 'Get Matched',
      desc: 'Our admin team reviews your submission within 24 hours and matches you with the best-fit builder for your tech stack and budget.',
      color: 'bg-purple-600',
    },
    {
      number: '03',
      icon: TrendingUp,
      title: 'Track Progress',
      desc: 'Follow every stage of your project in real time from your dashboard — from approval to final delivery.',
      color: 'bg-emerald-600',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">
            How It Works
          </p>
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black text-slate-900 leading-tight mb-4">
            From idea to delivery in 3 steps
          </h2>
          <p className="text-[15px] text-slate-500 max-w-xl mx-auto">
            No complicated setup. Just describe what you need and we handle the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div aria-hidden className="hidden md:block absolute top-9 left-[calc(16.7%+1.5rem)] right-[calc(16.7%+1.5rem)] h-px bg-gradient-to-r from-indigo-200 via-purple-200 to-emerald-200" />

          {steps.map(({ number, icon: Icon, title, desc, color }) => (
            <div key={number} className="relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all">
              {/* Number badge */}
              <div className="absolute -top-3 left-6">
                <span className="text-[10px] font-black text-white bg-slate-400 px-2 py-0.5 rounded-full tracking-widest">
                  {number}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5 mt-3 shadow-lg`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Matching',
      desc: 'Our team reviews and assigns expert builders within 24 hours — no lengthy back-and-forth.',
      bg: 'bg-amber-50', color: 'text-amber-600', border: 'border-amber-100',
    },
    {
      icon: ShieldCheck,
      title: 'Admin Reviewed',
      desc: 'Every submission goes through our quality review process before being assigned.',
      bg: 'bg-emerald-50', color: 'text-emerald-600', border: 'border-emerald-100',
    },
    {
      icon: BarChart3,
      title: 'Live Dashboard',
      desc: 'Track status in real time — pending, approved, or in progress — all from your dashboard.',
      bg: 'bg-indigo-50', color: 'text-indigo-600', border: 'border-indigo-100',
    },
    {
      icon: Code2,
      title: 'Any Tech Stack',
      desc: 'React, Flutter, Python, Blockchain — we support all modern stacks and frameworks.',
      bg: 'bg-purple-50', color: 'text-purple-600', border: 'border-purple-100',
    },
    {
      icon: Globe,
      title: 'Remote Friendly',
      desc: 'Work with top student developers from anywhere. Fully remote, always on-time.',
      bg: 'bg-cyan-50', color: 'text-cyan-600', border: 'border-cyan-100',
    },
    {
      icon: MessageSquare,
      title: 'Dedicated Support',
      desc: 'Our support team is available throughout your project to answer questions.',
      bg: 'bg-rose-50', color: 'text-rose-600', border: 'border-rose-100',
    },
  ]

  return (
    <section id="features" className="py-24 px-6 bg-[#f8f7ff]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">Features</p>
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black text-slate-900 leading-tight mb-4">
            Everything you need to ship your project
          </h2>
          <p className="text-[15px] text-slate-500 max-w-xl mx-auto">
            Karyasetu is built to make project delivery seamless for students and builders alike.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, bg, color, border }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4`}>
                <Icon size={18} className={color} />
              </div>
              <h3 className="text-[14px] font-bold text-slate-900 mb-1.5">{title}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Project types ────────────────────────────────────────────
function ProjectTypes() {
  const types = [
    { icon: Globe,    label: 'Web Apps',     count: '80+ submitted'  },
    { icon: Cpu,      label: 'AI/ML',        count: '40+ submitted'  },
    { icon: Code2,    label: 'Mobile Apps',  count: '55+ submitted'  },
    { icon: FolderKanban, label: 'Other',    count: '30+ submitted'  },
  ]

  return (
    <section className="py-16 px-6 bg-white border-y border-slate-100">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
          Project Types We Support
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {types.map(({ icon: Icon, label, count }) => (
            <div key={label} className="flex flex-col items-center text-center p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/50 transition">
              <div className="w-10 h-10 rounded-xl bg-[#1e1b4b] flex items-center justify-center mb-3">
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-[13px] font-bold text-slate-900">{label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    {
      name: 'Aditi Kulkarni',
      role: 'CS Student, BITS Pilani',
      initials: 'AK',
      color: '#6366f1',
      stars: 5,
      text: "Karyasetu helped me find a developer for my capstone project within a day. The dashboard made it super easy to track everything. 10/10 would recommend.",
    },
    {
      name: 'Rahul Sharma',
      role: 'MBA Student, IIM Bangalore',
      initials: 'RS',
      color: '#8b5cf6',
      stars: 5,
      text: "I needed a mobile app prototype for my startup pitch. Karyasetu matched me with the perfect developer and I had a working prototype in 2 weeks.",
    },
    {
      name: 'Priya Mehta',
      role: 'Final Year, VIT Chennai',
      initials: 'PM',
      color: '#06b6d4',
      stars: 5,
      text: "The submission form is so well thought out. I didn't have to explain my requirements 10 times — the team understood exactly what I needed.",
    },
  ]

  return (
    <section id="testimonials" className="py-24 px-6 bg-[#f8f7ff]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">Testimonials</p>
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black text-slate-900 leading-tight">
            Students love Karyasetu
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map(({ name, role, initials, color, stars, text }) => (
            <div key={name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col">
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[13px] text-slate-600 leading-relaxed flex-1 mb-5">
                &ldquo;{text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                  style={{ background: color }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-900">{name}</p>
                  <p className="text-[11px] text-slate-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────
const FAQS = [
  { q: 'Who can submit projects on Karyasetu?', a: 'Any student from any college or university. You just need to create a free account and fill in your project details.' },
  { q: 'How long does it take to get matched?', a: 'Our admin team reviews every submission within 24 hours. Most students are matched with a builder the same day.' },
  { q: 'What types of projects are supported?', a: 'We support Web Apps, Mobile Apps, AI/ML projects, Blockchain, IoT, Desktop applications, and more.' },
  { q: 'Is there a cost to submit?', a: 'Submitting a project is free. The budget you mention in your form goes directly toward hiring a builder for your project.' },
  { q: 'Can I attach files or reference links?', a: 'Yes! The submission form supports PDF, DOCX, ZIP, PNG, and JPG file uploads, plus any reference links like GitHub repos or Figma designs.' },
]

function FAQ() {
  return (
    <section id="faq" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">FAQ</p>
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black text-slate-900 leading-tight">
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-slate-100 transition">
                <span className="text-[14px] font-semibold text-slate-900">{q}</span>
                <ChevronDown
                  size={16}
                  className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform duration-200"
                />
              </summary>
              <div className="px-6 pb-5">
                <p className="text-[13px] text-slate-500 leading-relaxed">{a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Banner ───────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-20 px-6 bg-[#1e1b4b] relative overflow-hidden">
      {/* Glow */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-7">
          <CheckCircle2 size={12} className="text-emerald-400" />
          <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">
            Free to get started
          </span>
        </div>

        <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-black text-white leading-tight mb-5">
          Ready to ship your project?
        </h2>
        <p className="text-[15px] text-indigo-200 leading-relaxed mb-10 max-w-xl mx-auto">
          Join 200+ students who are already using Karyasetu to turn their
          ideas into real, working products.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 bg-white text-indigo-800 text-[15px] font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition shadow-xl w-full sm:w-auto justify-center"
          >
            Submit Your Project
            <ArrowRight size={17} />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 bg-white/10 border border-white/10 text-white text-[15px] font-semibold px-8 py-4 rounded-2xl hover:bg-white/15 transition w-full sm:w-auto justify-center"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-slate-950 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-base font-black text-white tracking-tight">Karyasetu.</span>
            </div>
            <p className="text-[12px] text-slate-400 max-w-[20ch] leading-relaxed">
              Bridging the gap between student ideas and expert builders.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-3">
            {[
              { label: 'Home',         href: '/'            },
              { label: 'Features',     href: '#features'    },
              { label: 'How It Works', href: '#how-it-works'},
              { label: 'Sign In',      href: '/login'       },
              { label: 'FAQ',          href: '#faq'         },
              { label: 'Contact',      href: 'mailto:support@karyasetu.com'},
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[12px] text-slate-400 hover:text-white transition"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Karyasetu. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service'].map(item => (
              <a key={item} href="#" className="text-[11px] text-slate-500 hover:text-slate-300 transition">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Page export ──────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <Features />
        <ProjectTypes />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}