'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [error, setError]         = useState('')
  const [attempts, setAttempts]   = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin/leads')
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setAttempts(a => a + 1)
        if (res.status === 429) {
          setError('Muitas tentativas. Aguarde 15 minutos.')
        } else {
          setError(data.error ?? 'Senha incorreta.')
        }
        setPassword('')
      }
    })
  }

  return (
    <main className="min-h-screen gradient-primary flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900">AutoAtende</h1>
          <p className="text-neutral-500 text-sm mt-1">Painel do cliente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Senha de acesso
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoFocus
                placeholder="••••••••••••"
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm pr-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
              {attempts >= 3 && attempts < 5 && (
                <span className="block mt-1 text-xs text-red-500">
                  {5 - attempts} tentativa(s) restante(s) antes do bloqueio.
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !password}
            className="w-full gradient-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending
              ? <><Loader2 size={18} className="animate-spin" /> Entrando...</>
              : 'Entrar no painel'
            }
          </button>
        </form>

        <p className="text-center text-neutral-400 text-xs mt-8">
          Esqueceu a senha? Entre em contato com o suporte AutoAtende.
        </p>
      </div>
    </main>
  )
}
