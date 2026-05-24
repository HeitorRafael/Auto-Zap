'use client'

import { motion } from 'framer-motion'
import { Clock, TrendingDown, PhoneOff } from 'lucide-react'

const stats = [
  {
    icon: TrendingDown,
    color: 'text-red-500',
    bg: 'bg-red-50',
    number: '82,4%',
    label: 'das novas empresas da Baixada Santista são MEIs',
    detail: 'Sem equipe para atender. Cada mensagem não respondida é um cliente perdido.',
  },
  {
    icon: Clock,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    number: '5 min',
    label: 'é o tempo máximo que um lead imobiliário espera resposta',
    detail: 'Depois disso, ele já enviou mensagem para o concorrente.',
  },
  {
    icon: PhoneOff,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    number: '67%',
    label: 'das reservas perdidas em restaurantes são por falta de resposta no WA',
    detail: 'Fora do horário comercial, sem atendimento = sem reserva.',
  },
]

export default function ProblemaSection() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">O problema</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mt-3 mb-4">
            Você perde clientes <span className="text-red-500">sem perceber</span>
          </h2>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
            Enquanto você dorme, janta ou está em atendimento, leads chegam no WhatsApp
            — e vão embora sem resposta.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-2xl ${stat.bg} mb-6`}>
                  <Icon size={28} className={stat.color} />
                </div>
                <div className={`text-5xl font-extrabold mb-2 ${stat.color}`}>{stat.number}</div>
                <p className="text-lg font-semibold text-neutral-800 mb-3 leading-snug">{stat.label}</p>
                <p className="text-neutral-500 text-sm leading-relaxed">{stat.detail}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Destaque */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 gradient-primary rounded-3xl p-8 text-white text-center"
        >
          <p className="text-2xl font-bold">
            A solução não é contratar mais um atendente.
            <br />
            <span className="text-accent">É automatizar o atendimento inicial.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
