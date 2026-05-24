'use client'

import { useState } from 'react'
import { MessageCircle, Download, Search, ChevronUp, ChevronDown } from 'lucide-react'
import type { Lead } from '@/lib/sheets'

const STATUS_CONFIG: Record<Lead['status'], { label: string; cls: string }> = {
  'Novo':           { label: '🟡 Novo',           cls: 'bg-yellow-100 text-yellow-800' },
  'Em atendimento': { label: '🔵 Em atendimento', cls: 'bg-blue-100   text-blue-800'   },
  'Transferido':    { label: '🟣 Transferido',    cls: 'bg-purple-100 text-purple-800' },
  'Fechado':        { label: '🟢 Fechado',        cls: 'bg-green-100  text-green-800'  },
  'Perdido':        { label: '🔴 Perdido',        cls: 'bg-red-100    text-red-800'    },
}

type SortKey = keyof Lead
type SortDir = 'asc' | 'desc'

function exportCSV(leads: Lead[]) {
  const header = 'Data/Hora,Nome,Telefone,Intenção,Localização,Orçamento,Status'
  const rows = leads.map(l =>
    [l.dataHora, l.nome, l.telefone, l.intencao, l.localizacao, l.orcamento, l.status]
      .map(v => `"${v}"`)
      .join(',')
  )
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `leads-autoatende-${new Date().toISOString().slice(0,10)}.csv`
  a.click(); URL.revokeObjectURL(url)
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [search, setSearch]     = useState('')
  const [sortKey, setSortKey]   = useState<SortKey>('dataHora')
  const [sortDir, setSortDir]   = useState<SortDir>('desc')
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = leads
    .filter(l => {
      const q = search.toLowerCase()
      const matchSearch = !q || l.nome.toLowerCase().includes(q) || l.telefone.includes(q)
      const matchStatus = statusFilter === 'todos' || l.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      const v1 = a[sortKey] ?? ''; const v2 = b[sortKey] ?? ''
      return sortDir === 'asc' ? v1.localeCompare(v2) : v2.localeCompare(v1)
    })

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={14} className="text-neutral-300" />
    return sortDir === 'asc'
      ? <ChevronUp size={14} className="text-primary" />
      : <ChevronDown size={14} className="text-primary" />
  }

  function Th({ col, label }: { col: SortKey; label: string }) {
    return (
      <th
        className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-neutral-800 select-none whitespace-nowrap"
        onClick={() => toggleSort(col)}
      >
        <span className="inline-flex items-center gap-1">{label}<SortIcon col={col} /></span>
      </th>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">

      {/* Barra de filtros */}
      <div className="p-4 border-b border-neutral-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {/* Busca */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar nome ou telefone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-primary w-56"
            />
          </div>
          {/* Filtro status */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-sm border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary"
          >
            <option value="todos">Todos os status</option>
            {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <span>{filtered.length} de {leads.length} leads</span>
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 text-primary hover:text-primary-dark font-medium transition-colors"
          >
            <Download size={15} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <Th col="dataHora"    label="Data/Hora"   />
              <Th col="nome"        label="Nome"        />
              <Th col="telefone"    label="Telefone"    />
              <Th col="intencao"    label="Intenção"    />
              <Th col="localizacao" label="Localização" />
              <Th col="orcamento"   label="Orçamento"   />
              <Th col="status"      label="Status"      />
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-neutral-400 text-sm">
                  Nenhum lead encontrado com esses filtros.
                </td>
              </tr>
            ) : filtered.map((lead, i) => {
              const st = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG['Novo']
              const tel = lead.telefone.replace(/\D/g, '')
              return (
                <tr key={i} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">{lead.dataHora}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-neutral-900 whitespace-nowrap">{lead.nome}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600 whitespace-nowrap">{lead.telefone}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{lead.intencao}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{lead.localizacao}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600 whitespace-nowrap">{lead.orcamento}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${st.cls}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://wa.me/${tel}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Abrir no WhatsApp"
                      className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-dark font-medium transition-colors"
                    >
                      <MessageCircle size={14} /> WA
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
