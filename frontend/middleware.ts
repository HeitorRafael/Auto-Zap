import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-me')

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rota de login — sempre permitida
  if (pathname === '/admin') return NextResponse.next()

  // Rotas protegidas: /admin/*
  if (pathname.startsWith('/admin/')) {
    const token = request.cookies.get('autoatende_session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    try {
      await jwtVerify(token, SECRET)
      return NextResponse.next()
    } catch {
      const res = NextResponse.redirect(new URL('/admin', request.url))
      res.cookies.delete('autoatende_session')
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
