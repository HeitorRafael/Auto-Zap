'use client'

import { motion } from 'framer-motion'
import { MessageSquare, ClipboardList, Bot, UserCheck } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Cliente manda mensagem',
    desc: 'Qualquer horário — 2h da manhã, domingo, feriado. O WhatsApp da sua empresa responde na hora.',
    color: 'from-blue-500 to-primary',
  },
  {
    icon: ClipboardList,
    number: '02',
    title: 'Bot qualifica automaticamente',
    desc: 'Perguntas certas para entender o que o cliente precisa: serviço, orçamento, urgência, localização.',
    color: 'from-primary to-violet-600',
  },
  {
    icon: Bot,
    number: '03',
    title: 'IA responde as dúvidas',
    desc: 'Perguntas sobre serviços, preços, horários e procedimentos respondidas com base nos seus dados.',
    color: 'from-violet-600 to-accent',
  },
  {
    icon: UserCheck,
    number: '04',
    title: 'Lead qualificado chega pra você',
    desc: 'Você recebe no WhatsApp: nome, contato e tudo que o cliente informou. Só fechar o negócio.',
    color: 'from-accent to-green-600',
  },
]

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Como funciona</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mt-3 mb-4">
            4 passos. Totalmente automático.
          </h2>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
            Do primeiro contato até o lead qualificado na sua mão — sem você precisar fazer nada.
          </p>
        </motion.div>

        <div className="relative">
          {/* Linha conectora (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500 via-primary via-violet-600 to-accent opacity-30" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="relative text-center"
                >
                  {/* Ícone com gradiente */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg mb-6 mx-auto relative z-10`}>
                    <Icon size={28} className="text-white" />
                  </div>

                  <div className="text-6xl font-black text-neutral-100 -mt-4 mb-1 select-none">{step.number}</div>

                  <h3 className="text-lg font-bold text-neutral-900 mb-3 leading-snug">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA inline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="#segmentos"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors text-lg"
          >
            Ver demonstração por segmento ↓
          </a>
        </motion.div>
      </div>
    </section>
  )
}
