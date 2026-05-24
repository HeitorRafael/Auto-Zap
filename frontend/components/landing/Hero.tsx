'use client'

import { motion } from 'framer-motion'
import { MessageCircle, ChevronDown } from 'lucide-react'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_CONTATO ?? '5513999999999'

/* Bolhas de chat animadas simulando um atendimento */
const chatBubbles = [
  { side: 'guest', text: 'Boa tarde! Quero informações sobre aluguel 🏠', delay: 0.2 },
  { side: 'host',  text: 'Olá! Claro 😊 Qual região você prefere em Praia Grande?', delay: 1.0 },
  { side: 'guest', text: 'Aviação, 2 dormitórios, até R$ 2.500', delay: 1.8 },
  { side: 'host',  text: '✅ Temos 3 opções perfeitas! Nosso corretor te liga amanhã às 9h 🎉', delay: 2.6 },
]

function ChatMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Celular */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-neutral-900 p-2 overflow-hidden">
        {/* Status bar */}
        <div className="bg-neutral-900 rounded-t-[2rem] px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-white text-xs font-medium flex-1">AutoAtende Bot</span>
          <MessageCircle size={14} className="text-white/70" />
        </div>

        {/* Chat area */}
        <div className="bg-[#ECE5DD] min-h-[280px] p-3 space-y-2">
          {chatBubbles.map((bubble, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: bubble.delay, duration: 0.4 }}
              className={`flex ${bubble.side === 'host' ? 'justify-start' : 'justify-end'}`}
            >
              <span
                className={`max-w-[75%] text-xs px-3 py-2 rounded-2xl shadow-sm leading-relaxed ${
                  bubble.side === 'host'
                    ? 'bg-white text-neutral-800 rounded-tl-sm'
                    : 'bg-[#DCF8C6] text-neutral-800 rounded-tr-sm'
                }`}
              >
                {bubble.text}
              </span>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 3.4, duration: 1.5, repeat: Infinity }}
            className="flex justify-start"
          >
            <span className="bg-white text-xs px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm text-neutral-400">
              digitando...
            </span>
          </motion.div>
        </div>

        {/* Input bar */}
        <div className="bg-[#F0F0F0] rounded-b-[2rem] px-3 py-2 flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full h-8 px-3 flex items-center">
            <span className="text-xs text-neutral-400">Mensagem</span>
          </div>
          <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
            <MessageCircle size={14} className="text-white" />
          </div>
        </div>
      </div>

      {/* Badge 24h */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="absolute -top-3 -right-3 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
      >
        24h / 7 dias
      </motion.div>

      {/* Badge IA */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
        className="absolute -bottom-3 -left-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
      >
        ✨ IA integrada
      </motion.div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="min-h-screen gradient-primary flex flex-col justify-center relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Texto */}
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6"
            >
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Praia Grande · Santos · São Vicente
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-balance mb-6"
            >
              Seu WhatsApp atendendo clientes{' '}
              <span className="text-accent">às 3h da manhã</span>{' '}
              — sem você precisar responder
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl text-white/80 mb-10 max-w-xl"
            >
              Automação inteligente para imobiliárias, restaurantes e clínicas
              da Baixada Santista. Qualifique leads, responda dúvidas e agende
              — tudo no piloto automático.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href={`https://wa.me/${WHATSAPP}?text=Olá! Quero uma demonstração gratuita do AutoAtende`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-accent/30"
              >
                <MessageCircle size={22} />
                Quero uma demonstração gratuita
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-200"
              >
                Ver como funciona
                <ChevronDown size={20} />
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-white/50 text-sm"
            >
              🔒 Sem fidelidade · Setup em até 5 dias · Garantia de 30 dias
            </motion.p>
          </div>

          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="flex justify-center"
          >
            <ChatMockup />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  )
}
