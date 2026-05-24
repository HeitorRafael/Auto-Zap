import { getLeads, calcMetrics } from '@/lib/sheets'
import StatsCards from '@/components/dashboard/StatsCards'

export const revalidate = 300

function BarChart({ data }: { data: Record<string, number> }) {
  const max = Math.max(...Object.values(data), 1)
  return (
    <div className="flex items-end gap-3 h-32 pt-4">
      {Object.entries(data).map(([dia, qtd]) => (
        <div key={dia} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-neutral-600">{qtd || ''}</span>
          <div className="w-full rounded-t-lg transition-all duration-500 bg-gradient-to-t from-primary to-primary-light"
            style={{ height: `${(qtd / max) * 80}px`, minHeight: qtd > 0 ? '6px' : '2px', opacity: qtd > 0 ? 1 : 0.2 }}
          />
          <span className="text-xs text-neutral-400">{dia}</span>
        </div>
      ))}
    </div>
  )
}

function MiniDonut({ pct, color }: { pct: number; color: string }) {
  const r = 30; const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 40 40)"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x="40" y="45" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0F172A">
        {pct}%
      </text>
    </svg>
  )
}

export default async function RelatorioPage() {
  const leads   = await getLeads()
  const metrics = calcMetrics(leads)

  const pctQualif  = metrics.total > 0 ? Math.round((metrics.qualificados  / metrics.total) * 100) : 0
  const pctFechado = metrics.total > 0 ? Math.round((metrics.fechados      / metrics.total) * 100) : 0
  const pctPerdido = metrics.total > 0 ? Math.round((metrics.perdidos      / metrics.total) * 100) : 0

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Relatório</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Resumo de desempenho baseado nos dados do Google Sheets.
        </p>
      </div>

      <StatsCards
        total={metrics.total}
        qualificados={metrics.qualificados}
        fechados={metrics.fechados}
        perdidos={metrics.perdidos}
        conversao={metrics.conversao}
      />

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Leads por dia da semana */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
          <h2 className="text-base font-bold text-neutral-900 mb-1">Leads por dia da semana</h2>
          <p className="text-xs text-neutral-400 mb-4">Distribuição histórica dos atendimentos</p>
          <BarChart data={metrics.porDia} />
        </div>

        {/* Funil */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
          <h2 className="text-base font-bold text-neutral-900 mb-1">Funil de conversão</h2>
          <p className="text-xs text-neutral-400 mb-6">% em relação ao total de leads</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <MiniDonut pct={pctQualif} color="#0F4C81" />
              <p className="text-xs font-semibold text-neutral-700 mt-2">Qualificados</p>
            </div>
            <div>
              <MiniDonut pct={pctFechado} color="#00C896" />
              <p className="text-xs font-semibold text-neutral-700 mt-2">Fechados</p>
            </div>
            <div>
              <MiniDonut pct={pctPerdido} color="#ef4444" />
              <p className="text-xs font-semibold text-neutral-700 mt-2">Perdidos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo textual — mesmo formato do n8n */}
      <div className="bg-neutral-900 rounded-2xl p-6 text-white">
        <h2 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">
          📊 Preview do relatório semanal (enviado toda segunda às 8h)
        </h2>
        <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed">
{`📊 Relatório Semanal — AutoAtende

📥 Leads recebidos: ${metrics.total}
✅ Qualificados: ${metrics.qualificados} (${pctQualif}%)
💬 Transferidos: ${metrics.transferidos}
🤝 Fechados: ${metrics.fechados}
🎯 Taxa de conversão: ${metrics.conversao}%

📅 Leads por dia:
${Object.entries(metrics.porDia).map(([d, q]) => `${d}: ${'█'.repeat(q)}${'░'.repeat(Math.max(0,5-q))} (${q})`).join('\n')}

_Relatório gerado automaticamente pelo AutoAtende_ 🤖`}
        </pre>
      </div>
    </div>
  )
}
