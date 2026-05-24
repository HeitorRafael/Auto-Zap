import { Users, TrendingUp, Handshake, AlertCircle } from 'lucide-react'

type Props = {
  total: number
  qualificados: number
  fechados: number
  perdidos: number
  conversao: string
}

export default function StatsCards({ total, qualificados, fechados, perdidos, conversao }: Props) {
  const cards = [
    {
      icon: Users,
      label: 'Total de leads',
      value: total,
      sub: 'recebidos',
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
    },
    {
      icon: TrendingUp,
      label: 'Qualificados',
      value: qualificados,
      sub: `${total > 0 ? ((qualificados / total) * 100).toFixed(0) : 0}% do total`,
      color: 'bg-violet-50 text-violet-600',
      border: 'border-violet-100',
    },
    {
      icon: Handshake,
      label: 'Fechados',
      value: fechados,
      sub: `${conversao}% de conversão`,
      color: 'bg-green-50 text-green-600',
      border: 'border-green-100',
    },
    {
      icon: AlertCircle,
      label: 'Perdidos',
      value: perdidos,
      sub: `${total > 0 ? ((perdidos / total) * 100).toFixed(0) : 0}% do total`,
      color: 'bg-red-50 text-red-500',
      border: 'border-red-100',
    },
  ]

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map(({ icon: Icon, label, value, sub, color, border }) => (
        <div key={label} className={`bg-white rounded-2xl p-6 border ${border} shadow-sm`}>
          <div className={`inline-flex p-2.5 rounded-xl ${color} mb-4`}>
            <Icon size={20} />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 mb-1">{value}</div>
          <div className="text-sm font-semibold text-neutral-700">{label}</div>
          <div className="text-xs text-neutral-400 mt-0.5">{sub}</div>
        </div>
      ))}
    </div>
  )
}
