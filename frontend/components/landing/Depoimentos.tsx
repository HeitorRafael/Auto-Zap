'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

// Placeholder — substituir pelos depoimentos reais dos primeiros clientes
const depoimentos = [
  {
    nome: 'Rafael M.',
    cargo: 'Corretor de Imóveis',
    cidade: 'Praia Grande',
    texto: 'Antes eu perdia leads todo final de semana. Agora o bot qualifica tudo sozinho e recebo a notificação no celular. Fechei 2 contratos só na primeira semana.',
    stars: 5,
    iniciais: 'RM',
    cor: 'bg-primary',
    simulado: true,
  },
  {
    nome: 'Camila T.',
    cargo: 'Proprietária',
    cidade: 'Clínica de Estética · Santos',
    texto: 'Meu WhatsApp ficava cheio de mensagens que eu não conseguia responder a tempo. Agora o bot agenda automaticamente e eu só confirmo. Simplesmente incrível.',
    stars: 5,
    iniciais: 'CT',
    cor: 'bg-violet-600',
    simulado: true,
  },
  {
    nome: 'Bruno A.',
    cargo: 'Gerente',
    cidade: 'Restaurante · Gonzaga, Santos',
    texto: 'As reservas aumentaram 40% no primeiro mês. O bot responde sobre cardápio, horários e ainda avisa a gente quando tem reserva grande chegando.',
    stars: 5,
    iniciais: 'BA',
    cor: 'bg-orange-500',
    simulado: true,
  },
]

export default function Depoimentos() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Resultados</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mt-3 mb-4">
            O que nossos clientes dizem
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {depoimentos.map((dep, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 flex flex-col relative"
            >
              <Quote size={32} className="text-neutral-100 absolute top-6 right-6" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: dep.stars }).map((_, j) => (
                  <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-neutral-700 text-sm leading-relaxed flex-1 italic mb-6">
                "{dep.texto}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${dep.cor} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                  {dep.iniciais}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{dep.nome}</p>
                  <p className="text-neutral-400 text-xs">{dep.cargo} · {dep.cidade}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
