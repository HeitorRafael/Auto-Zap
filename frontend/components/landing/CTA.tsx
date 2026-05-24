'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Clock, Shield, Zap } from 'lucide-react'

const WA = '5513994902633'
const WA_MSG = encodeURIComponent('Olá! Vi o site do AutoAtende e quero saber mais sobre a automação de WhatsApp para o meu negócio.')

const garantias = [
  { icon: Clock,         text: 'Bot no ar em até 5 dias úteis' },
  { icon: Shield,        text: 'Garantia de 30 dias ou devolvemos o setup' },
  { icon: Zap,           text: 'Sem fidelidade mínima — cancele quando quiser' },
  { icon: MessageCircle, text: 'Suporte direto pelo WhatsApp' },
]

export default function CTA() {
  return (
    <section id="contato" className="py-24 bg-neutral-900 relative overflow-hidden">
      {/* Fundo decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-4">
            Vamos conversar?
          </span>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Pronto para não perder
            <br />
            <span className="text-accent">mais um cliente?</span>
          </h2>

          <p className="text-xl text-white/60 mb-10 max-w-xl mx-auto">
            Me chama no WhatsApp agora. Conto como funciona, mostro uma demonstração
            e faço um orçamento sem compromisso para o seu negócio.
          </p>
        </motion.div>

        {/* Botão principal */}
        <motion.a
          href={`https://wa.me/${WA}?text=${WA_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 gradient-accent text-white font-bold px-10 py-5 rounded-2xl text-xl shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-shadow"
        >
          <MessageCircle size={26} />
          Falar com Heitor no WhatsApp
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-white/30 text-sm mt-4"
        >
          Tempo médio de resposta: menos de 2 horas
        </motion.p>

        {/* Garantias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-14 grid sm:grid-cols-2 gap-4 text-left"
        >
          {garantias.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <Icon size={18} className="text-accent flex-shrink-0" />
              <span className="text-white/70 text-sm">{text}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
