// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }





import Link from 'next/link'
import { ArrowRight, Code, Shield, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[120px] opacity-60"></div>
      
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-extrabold tracking-tight text-indigo-950">Karyasetu.</div>
        <div className="space-x-4">
          <Link href="/login" className="px-5 py-2.5 text-indigo-900 font-medium hover:text-indigo-600 transition">Log In</Link>
          <Link href="/login" className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 transition">Get Started</Link>
        </div>
      </nav>

      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white shadow-sm border border-indigo-100 text-sm font-semibold text-indigo-600">
          ✨ The Ultimate Work Bridge
        </div>
        <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
          Empowering Students to <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Build the Future</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Submit your project requirements, get matched with expert developers, and bring your ideas to life through our seamless digital therapeutics platform for builders.
        </p>
        <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full text-lg font-semibold hover:bg-slate-800 transition shadow-xl shadow-slate-300">
          Submit a Project <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  )
}