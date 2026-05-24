'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const TYPEBOT_BASE = process.env.NEXT_PUBLIC_TYPEBOT_VIEWER_URL ?? 'https://bot.autoatende.com.br'

const segmentos = [
  {
    emoji: '🏠',
    nome: 'Imobiliárias',
    cidade: 'Praia Grande',
    dor: 'Leads perdidos fora do horário comercial',
    features: ['Triagem automática de perfil', 'Envio de portfólio de imóveis', 'Agendamento de visita', 'Notificação do corretor em tempo real'],
    cor: 'from-blue-500 to-primary',
    corBg: 'bg-blue-50',
    corText: 'text-primary',
    demo: '/demo/imobiliaria',
  },
  {
    emoji: '🍽️',
    nome: 'Restaurantes e Bares',
    cidade: 'Santos (Gonzaga)',
    dor: 'Reservas perdidas sem atendente disponível',
    features: ['Reservas automáticas 24h', 'Envio de cardápio interativo', 'Confirmação por WhatsApp', 'Gestão de lista de espera'],
    cor: 'from-orange-400 to-red-500',
    corBg: 'bg-orange-50',
    corText: 'text-orange-600',
    demo: '/demo/restaurante',
  },
  {
    emoji: '✂️',
    nome: 'Estética e Clínicas',
    cidade: 'Santos / São Vicente',
    dor: 'Agendamentos perdidos e sem resposta no WA',
    features: ['Agendamentos automáticos', 'Tabela de procedimentos e valores', 'Orientações pré-procedimento via IA', 'Confirmação e lembrete automático'],
    cor: 'from-violet-500 to-pink-500',
    corBg: 'bg-violet-50',
    corText: 'text-violet-600',
    demo: '/demo/estetica',
  },
]

export default function Segmentos() {
  return (
    <section id="segmentos" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Segmentos</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mt-3 mb-4">
            Feito para o seu negócio
          </h2>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
            Fluxos personalizados para cada nicho. Teste a demonstração do seu segmento agora.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {segmentos.map((seg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Header colorido */}
              <div className={`bg-gradient-to-br ${seg.cor} p-6 text-white`}>
                <div className="text-5xl mb-3">{seg.emoji}</div>
                <h3 className="text-xl font-bold">{seg.nome}</h3>
                <p className="text-white/70 text-sm mt-1">{seg.cidade}</p>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className={`inline-block ${seg.corBg} ${seg.corText} text-xs font-semibold px-3 py-1 rounded-full mb-4`}>
                  Dor principal: {seg.dor}
                </div>

                <ul className="space-y-2 flex-1">
                  {seg.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="text-accent mt-0.5 font-bold">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <a
                  href={seg.demo}
                  className={`mt-6 flex items-center justify-center gap-2 bg-gradient-to-r ${seg.cor} text-white font-semibold py-3 px-6 rounded-2xl text-sm hover:opacity-90 transition-opacity`}
                >
                  Ver demonstração
                  <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MEI note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-neutral-400 mt-8 text-sm"
        >
          Também atendemos MEIs e prestadores de serviço autônomos.{' '}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_CONTATO}`}
            className="text-primary font-medium hover:underline"
          >
            Fale conosco
          </a>
        </motion.p>
      </div>
    </section>
  )
}
