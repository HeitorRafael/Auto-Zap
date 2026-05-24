import { compare } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET   = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-me')
const HASH     = process.env.ADMIN_PASSWORD_HASH ?? ''
const COOKIE   = 'autoatende_session'
const TTL_SECS = 60 * 60 * 8 // 8 horas

// ─── Verificar senha ────────────────��─────────────────────────────────────────
export async function verifyPassword(password: string): Promise<boolean> {
  if (!HASH) {
    console.error('ADMIN_PASSWORD_HASH não configurada no .env.local')
    return false
  }
  return compare(password, HASH)
}

// ─── Gerar JWT ────────────────────────────────────────────────────────────────
export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECS}s`)
    .sign(SECRET)
}

// ─── Verificar sessão (Server Component / Server Action) ──────────────────────
export async function getSession(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return false
  try {
    await jwtVerify(token, SECRET)
    return true
  } catch {
    return false
  }
}

// ─── Rate limiting em memória (reinicia ao reiniciar o servidor) ──────────────
const attempts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now   = Date.now()
  const entry = attempts.get(ip)

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return { allowed: true, remaining: 4 }
  }
  if (entry.count >= 5) return { allowed: false, remaining: 0 }
  entry.count++
  return { allowed: true, remaining: 5 - entry.count }
}

export function resetRateLimit(ip: string) {
  attempts.delete(ip)
}

export { COOKIE, TTL_SECS }
