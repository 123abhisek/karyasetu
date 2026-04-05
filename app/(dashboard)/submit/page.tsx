'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Briefcase,
  AlignLeft,
  Cpu,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  Link2,
  Upload,
  FileText,
  Loader2,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react'

const PROJECT_TYPES = [
  'Web App',
  'Mobile App',
  'AI/ML Project',
  'Blockchain',
  'IoT',
  'Desktop App',
  'Other',
]

type FormData = {
  title: string
  project_type: string
  description: string
  features_required: string
  tech_stack: string
  budget: string
  deadline: string
  contact_name: string
  email: string
  phone: string
  reference_links: string
  additional_notes: string
}

const INITIAL_FORM: FormData = {
  title: '',
  project_type: 'Web App',
  description: '',
  features_required: '',
  tech_stack: '',
  budget: '',
  deadline: '',
  contact_name: '',
  email: '',
  phone: '',
  reference_links: '',
  additional_notes: '',
}

// ── Reusable input wrapper ──────────────────────────────────
function Field({
  label,
  required,
  icon: Icon,
  hint,
  children,
}: {
  label: string
  required?: boolean
  icon?: React.ElementType
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[12px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
        {label}
        {required && <span className="text-indigo-500 ml-0.5">*</span>}
      </label>
      {Icon ? (
        <div className="relative">
          <Icon
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
          />
          {children}
        </div>
      ) : (
        children
      )}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

const inputCls =
  'w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'

const textareaCls =
  'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none'

const selectCls =
  'w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none'

// ── Section card ────────────────────────────────────────────
function Section({
  step,
  title,
  subtitle,
  children,
}: {
  step: number
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-4">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 text-white text-xs font-black shadow-md shadow-indigo-200">
          {step}
        </div>
        <div>
          <p className="text-[14px] font-bold text-slate-900 leading-tight">{title}</p>
          <p className="text-[11px] text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  )
}

export default function SubmitPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [file, setFile]         = useState<File | null>(null)
  const [loading, setLoading]   = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleFile = (f: File) => {
    const MAX = 10 * 1024 * 1024
    const ALLOWED = ['application/pdf', 'application/zip', 'image/png', 'image/jpeg',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!ALLOWED.includes(f.type)) {
      toast.error('Only PDF, DOCX, ZIP, PNG, JPG allowed')
      return
    }
    if (f.size > MAX) {
      toast.error('File must be under 10MB')
      return
    }
    setFile(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim())       { toast.error('Project title is required'); return }
    if (!formData.description.trim()) { toast.error('Description is required'); return }

    setLoading(true)

    try {
      let file_url: string | null = null

      // 1 — Upload file via API route
      if (file) {
        const fd = new FormData()
        fd.append('file', file)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
        const uploadJson = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadJson.error)
        file_url = uploadJson.file_url
      }

      // 2 — Create submission via API route
      const payload = {
        title:             formData.title,
        project_type:      formData.project_type,
        description:       formData.description,
        features_required: formData.features_required,
        tech_stack:        formData.tech_stack,
        budget:            formData.budget ? Number(formData.budget) : null,
        deadline:          formData.deadline || null,
        phone:             formData.phone,
        email:             formData.email,
        reference_links:   formData.reference_links,
        additional_notes:  formData.additional_notes,
        file_url,
      }

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      toast.success('Project submitted successfully!')
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">

      {/* Page intro */}
      <div className="mb-7">
        <h2 className="text-xl font-black text-slate-900 mb-1">New Project Request</h2>
        <p className="text-[13px] text-slate-500">
          Fill in the details below. Our team will review and get back to you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* ── Section 1: Project Info ──────────────────── */}
        <Section step={1} title="Project Information" subtitle="Tell us about what you want to build">

          {/* Title */}
          <Field label="Project Title" required icon={Briefcase}>
            <input
              type="text"
              name="title"
              placeholder="e.g. Student Attendance Management System"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputCls}
            />
          </Field>

          {/* Project Type */}
          <Field label="Project Type" required icon={Cpu}>
            <select
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              className={selectCls}
            >
              {PROJECT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          {/* Description */}
          <Field
            label="Project Description"
            required
            hint="Describe your idea clearly — what problem it solves and who it's for."
          >
            <textarea
              name="description"
              rows={4}
              placeholder="Explain your project idea in detail..."
              value={formData.description}
              onChange={handleChange}
              required
              className={textareaCls}
            />
          </Field>

          {/* Features */}
          <Field
            label="Features Required"
            hint="List each feature on a new line — e.g. Login, Dashboard, Notifications"
          >
            <textarea
              name="features_required"
              rows={3}
              placeholder="User authentication&#10;Admin dashboard&#10;PDF export"
              value={formData.features_required}
              onChange={handleChange}
              className={textareaCls}
            />
          </Field>

          {/* Tech Stack */}
          <Field label="Preferred Tech Stack" icon={Cpu} hint="Leave blank if you have no preference">
            <input
              type="text"
              name="tech_stack"
              placeholder="e.g. Next.js, Supabase, React Native"
              value={formData.tech_stack}
              onChange={handleChange}
              className={inputCls}
            />
          </Field>
        </Section>

        {/* ── Section 2: Budget & Timeline ────────────── */}
        <Section step={2} title="Budget & Timeline" subtitle="Help us understand your constraints">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Budget (USD)" icon={DollarSign}>
              <input
                type="number"
                name="budget"
                placeholder="500"
                min={0}
                value={formData.budget}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>
            <Field label="Deadline" icon={Calendar}>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        {/* ── Section 3: Contact Information ──────────── */}
        <Section step={3} title="Contact Information" subtitle="How should we reach you?">
          <Field label="Your Full Name" icon={User}>
            <input
              type="text"
              name="contact_name"
              placeholder="Abhishek Juvatkar"
              value={formData.contact_name}
              onChange={handleChange}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email Address" icon={Mail}>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>
            <Field label="Phone / WhatsApp" icon={Phone}>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        {/* ── Section 4: Additional Information ───────── */}
        <Section step={4} title="Additional Information" subtitle="Optional but helpful">

          {/* Reference links */}
          <Field
            label="Reference Links"
            icon={Link2}
            hint="GitHub repos, Figma designs, similar websites — separate with commas"
          >
            <input
              type="text"
              name="reference_links"
              placeholder="https://github.com/..., https://figma.com/..."
              value={formData.reference_links}
              onChange={handleChange}
              className={inputCls}
            />
          </Field>

          {/* File upload */}
          <div>
            <label className="block text-[12px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Attach File
              <span className="text-[10px] font-normal text-slate-400 normal-case tracking-normal ml-2">
                PDF, DOCX, ZIP, PNG, JPG — max 10MB
              </span>
            </label>

            {file ? (
              /* File selected state */
              <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                  <FileText size={15} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-indigo-900 truncate">{file.name}</p>
                  <p className="text-[10px] text-indigo-400">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  aria-label="Remove file"
                  className="p-1 rounded-lg hover:bg-indigo-100 text-indigo-400 hover:text-indigo-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              /* Drop zone */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault()
                  setDragOver(false)
                  const f = e.dataTransfer.files[0]
                  if (f) handleFile(f)
                }}
                className={`w-full border-2 border-dashed rounded-xl px-6 py-8 flex flex-col items-center gap-2 transition-all ${
                  dragOver
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Upload size={18} className="text-slate-400" />
                </div>
                <p className="text-[13px] font-semibold text-slate-700">
                  Drop your file here or <span className="text-indigo-600">browse</span>
                </p>
                <p className="text-[11px] text-slate-400">Supports PDF, DOCX, ZIP, PNG, JPG</p>
              </button>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.zip,.png,.jpg,.jpeg"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />
          </div>

          {/* Notes */}
          <Field label="Additional Notes">
            <textarea
              name="additional_notes"
              rows={3}
              placeholder="Anything else you'd like us to know..."
              value={formData.additional_notes}
              onChange={handleChange}
              className={textareaCls}
            />
          </Field>
        </Section>

        {/* ── Submit bar ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            All submissions are reviewed within 24 hours.
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1e1b4b] text-white text-[13px] font-bold rounded-xl hover:bg-indigo-900 active:scale-95 transition-all shadow-md shadow-indigo-900/20 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Project
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}