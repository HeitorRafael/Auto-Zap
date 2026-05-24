import { getLeads } from '@/lib/sheets'
import LeadsTable from '@/components/dashboard/LeadsTable'
import StatsCards from '@/components/dashboard/StatsCards'
import { calcMetrics } from '@/lib/sheets'
import { RefreshCw } from 'lucide-react'

export const revalidate = 60 // revalida a cada 60s

export default async function LeadsPage() {
  const leads   = await getLeads()
  const metrics = calcMetrics(leads)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Leads</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Todos os contatos capturados pelo bot. Atualiza a cada 60 segundos.
          </p>
        </div>
        <form action="" method="GET">
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-primary border border-primary/30 px-4 py-2 rounded-xl hover:bg-primary/5 transition-colors font-medium"
          >
            <RefreshCw size={15} /> Atualizar
          </button>
        </form>
      </div>

      {/* Métricas */}
      <StatsCards
        total={metrics.total}
        qualificados={metrics.qualificados}
        fechados={metrics.fechados}
        perdidos={metrics.perdidos}
        conversao={metrics.conversao}
      />

      {/* Tabela */}
      <LeadsTable leads={leads} />
    </div>
  )
}
