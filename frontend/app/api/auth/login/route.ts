import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createSessionToken, checkRateLimit, resetRateLimit, COOKIE, TTL_SECS } from '@/lib/auth'

export async function POST(req: NextRequest) {
  // IP para rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        ?? req.headers.get('x-real-ip')
        ?? '127.0.0.1'

  const { allowed, remaining } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde 15 minutos.' },
      { status: 429 }
    )
  }

  let body: { password?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const { password } = body
  if (!password) {
    return NextResponse.json({ error: 'Senha obrigatória' }, { status: 400 })
  }

  const valid = await verifyPassword(password)
  if (!valid) {
    return NextResponse.json(
      { error: 'Senha incorreta', remaining },
      { status: 401 }
    )
  }

  // Senha correta — limpa rate limit e gera token
  resetRateLimit(ip)
  const token = await createSessionToken()

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, token, {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === 'production',
    sameSite:  'lax',
    maxAge:    TTL_SECS,
    path:      '/',
  })
  return res
}
