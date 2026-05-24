'use client'

import { useState } from 'react'
import { Save, ExternalLink, Upload, Bot, Clock } from 'lucide-react'

const TYPEBOT_URL = process.env.NEXT_PUBLIC_TYPEBOT_VIEWER_URL ?? 'https://flows.autoatende.com.br'

export default function ConfiguracoesPage() {
  const [horarios, setHorarios] = useState({
    seg: '09:00–18:00', ter: '09:00–18:00', qua: '09:00–18:00',
    qui: '09:00–18:00', sex: '09:00–18:00', sab: '',            dom: '',
  })
  const [saved, setSaved] = useState(false)

  const dias = [
    { key: 'seg', label: 'Segunda' }, { key: 'ter', label: 'Terça'   },
    { key: 'qua', label: 'Quarta'  }, { key: 'qui', label: 'Quinta'  },
    { key: 'sex', label: 'Sexta'   }, { key: 'sab', label: 'Sábado'  },
    { key: 'dom', label: 'Domingo' },
  ] as const

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // Aqui: POST para /api/configuracoes que salva no Google Drive
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-2xl">

      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Configurações</h1>
        <p className="text-neutral-500 text-sm mt-1">Ajuste as informações do seu bot.</p>
      </div>

      {/* Horários de funcionamento */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} className="text-primary" />
          <h2 className="text-base font-bold text-neutral-900">Horários de funcionamento</h2>
        </div>
        <p className="text-xs text-neutral-400 -mt-3">
          O bot responde 24h. Esse horário define quando um atendente humano está disponível.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {dias.map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">{label}</label>
              <input
                type="text"
                value={horarios[key]}
                onChange={e => setHorarios(h => ({ ...h, [key]: e.target.value }))}
                placeholder="Fechado"
                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 gradient-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          {saved ? '✅ Salvo!' : <><Save size={15} /> Salvar horários</>}
        </button>
      </form>

      {/* Upload de documentos */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Upload size={18} className="text-primary" />
          <h2 className="text-base font-bold text-neutral-900">Base de conhecimento do bot</h2>
        </div>
        <p className="text-xs text-neutral-400">
          Arquivos <code>.txt</code> usados pela IA para responder perguntas dos clientes.
          Atualize pelo Google Drive — as mudanças são refletidas em até 1 hora.
        </p>

        <div className="grid gap-3">
          {['faq.txt — Perguntas frequentes', 'servicos.txt — Serviços e preços', 'horarios.txt — Horários', 'politicas.txt — Políticas e pagamentos'].map(doc => (
            <div key={doc} className="flex items-center justify-between bg-neutral-50 rounded-xl px-4 py-3 text-sm">
              <span className="font-mono text-xs text-neutral-600">{doc}</span>
              <span className="text-xs text-neutral-400">via Google Drive</span>
            </div>
          ))}
        </div>

        <a
          href="https://drive.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
        >
          <ExternalLink size={14} /> Abrir pasta no Google Drive
        </a>
      </div>

      {/* Testar bot */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Bot size={18} className="text-primary" />
          <h2 className="text-base font-bold text-neutral-900">Testar o bot</h2>
        </div>
        <p className="text-xs text-neutral-400 mb-4">
          Acesse o fluxo do seu bot para ver como o cliente o experimenta.
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Bot Imobiliária', href: `${TYPEBOT_URL}/imobiliaria-praia-grande` },
            { label: 'Bot Restaurante', href: `${TYPEBOT_URL}/restaurante-santos`       },
            { label: 'Bot Clínica',     href: `${TYPEBOT_URL}/clinica-estetica`         },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-primary/30 text-primary text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/5 transition-colors"
            >
              <ExternalLink size={14} /> {label}
            </a>
          ))}
        </div>
      </div>

      {/* Link painel Typebot */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
        <p className="text-sm text-primary font-medium">
          ✏️ Quer editar os fluxos conversacionais?{' '}
          <a
            href={TYPEBOT_URL.replace('bot.', 'flows.')}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold"
          >
            Acesse o Typebot Builder →
          </a>
        </p>
      </div>
    </div>
  )
}
