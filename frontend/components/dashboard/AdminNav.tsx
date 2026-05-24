'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, BarChart2, Settings, LogOut, MessageCircle } from 'lucide-react'

const links = [
  { href: '/admin/leads',         icon: Users,          label: 'Leads' },
  { href: '/admin/relatorio',     icon: BarChart2,      label: 'Relatório' },
  { href: '/admin/configuracoes', icon: Settings,       label: 'Configurações' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-100 flex flex-col z-40">

      {/* Logo */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageCircle size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">AutoAtende</p>
            <p className="text-xs text-neutral-400">Painel do cliente</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-neutral-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}
