'use client'

import { motion } from 'framer-motion'
import { Check, Shield } from 'lucide-react'

const planos = [
  {
    nome: 'Starter',
    badge: null,
    setup: 'R$ 1.500',
    mensalidade: 'R$ 500',
    descricao: 'Ideal para quem está começando a automatizar o atendimento.',
    features: [
      '1 número de WhatsApp',
      '1 fluxo conversacional personalizado',
      'Integração com Google Sheets (leads)',
      'Notificação no WA quando lead chegar',
      'Painel de leads simples',
      'Relatório mensal automático',
      'Suporte via WhatsApp',
    ],
    cta: 'Começar com Starter',
    ctaStyle: 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white',
    highlight: false,
  },
  {
    nome: 'Pro',
    badge: '🔥 Mais popular',
    setup: 'R$ 2.500',
    mensalidade: 'R$ 800',
    descricao: 'Para negócios que querem escalar o atendimento com IA completa.',
    features: [
      '2 números de WhatsApp',
      'Fluxos ilimitados por nicho',
      'IA respondendo perguntas (RAG + GPT-4o-mini)',
      'Integração com Google Sheets e Drive',
      'Painel de leads completo com métricas',
      'Handoff para atendente humano (Chatwoot)',
      'Relatório semanal automático',
      'Suporte prioritário via WhatsApp',
      'Personalização visual do bot',
    ],
    cta: 'Começar com Pro',
    ctaStyle: 'gradient-accent text-white hover:opacity-90',
    highlight: true,
  },
]

export default function Precos() {
  return (
    <section id="precos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Investimento</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mt-3 mb-4">
            Simples e previsível
          </h2>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
            Taxa única de configuração + mensalidade. Sem surpresas, sem fidelidade mínima.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {planos.map((plano, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                plano.highlight
                  ? 'gradient-primary text-white shadow-2xl shadow-primary/30 scale-105'
                  : 'bg-neutral-50 border border-neutral-200'
              }`}
            >
              {plano.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow">
                  {plano.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-1 ${plano.highlight ? 'text-white' : 'text-neutral-900'}`}>
                  {plano.nome}
                </h3>
                <p className={`text-sm ${plano.highlight ? 'text-white/70' : 'text-neutral-500'}`}>
                  {plano.descricao}
                </p>
              </div>

              <div className="mb-6">
                <div className={`flex items-baseline gap-1 ${plano.highlight ? 'text-white' : 'text-neutral-900'}`}>
                  <span className="text-4xl font-extrabold">{plano.mensalidade}</span>
                  <span className={`text-sm ${plano.highlight ? 'text-white/70' : 'text-neutral-500'}`}>/mês</span>
                </div>
                <p className={`text-sm mt-1 ${plano.highlight ? 'text-white/60' : 'text-neutral-400'}`}>
                  + {plano.setup} de setup (único)
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plano.features.map((feat, j) => (
                  <li key={j} className={`flex items-start gap-3 text-sm ${plano.highlight ? 'text-white/90' : 'text-neutral-600'}`}>
                    <Check size={16} className={`mt-0.5 flex-shrink-0 ${plano.highlight ? 'text-accent' : 'text-accent'}`} />
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_CONTATO}?text=Olá! Tenho interesse no plano ${plano.nome} do AutoAtende`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-4 px-6 rounded-2xl font-bold text-center text-sm transition-all duration-200 hover:scale-[1.02] ${plano.ctaStyle}`}
              >
                {plano.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Garantia */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-3 mt-12 text-neutral-500"
        >
          <Shield size={20} className="text-accent" />
          <p className="text-sm">
            <strong className="text-neutral-700">Garantia de 30 dias:</strong>{' '}
            se não perceber melhora no atendimento, devolvemos o valor do setup integralmente.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-neutral-400 text-xs mt-4"
        >
          Valores para Praia Grande, Santos e São Vicente. Consulte para outras cidades.
        </motion.p>
      </div>
    </section>
  )
}
