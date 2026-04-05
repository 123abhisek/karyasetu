import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Safely get user — wrap in try/catch so a bad token never causes
  // an unhandled redirect loop
  let user = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error) user = data.user
  } catch {
    // Token parse failed — treat as logged out
    user = null
  }

  const isAuthRoute = pathname === '/login' || pathname === '/signup'
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/submit') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/admin')

  // 1. Not logged in → block protected pages
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', pathname) // preserve intended destination
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Already logged in → don't show auth pages again
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - api routes (handled by their own auth checks)
     * - public files (png, jpg, svg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}