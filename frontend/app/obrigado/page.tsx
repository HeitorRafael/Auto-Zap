import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function ObrigadoPage() {
  return (
    <main className="min-h-screen gradient-primary flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-12 max-w-lg w-full text-center shadow-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-6">
          <CheckCircle size={48} className="text-accent" />
        </div>

        <h1 className="text-3xl font-extrabold text-neutral-900 mb-4">
          Mensagem recebida! 🎉
        </h1>

        <p className="text-neutral-500 text-lg mb-8 leading-relaxed">
          Em até <strong className="text-primary">24 horas</strong> entramos em
          contato pelo seu WhatsApp com a demonstração personalizada para o seu negócio.
        </p>

        <div className="bg-neutral-50 rounded-2xl p-6 text-left mb-8">
          <p className="text-sm font-semibold text-neutral-700 mb-3">Próximos passos:</p>
          <ol className="space-y-2 text-sm text-neutral-600">
            <li className="flex gap-2"><span className="text-accent font-bold">1.</span> Você receberá um WhatsApp nosso em breve</li>
            <li className="flex gap-2"><span className="text-accent font-bold">2.</span> Agendaremos uma call de 15 minutos</li>
            <li className="flex gap-2"><span className="text-accent font-bold">3.</span> Mostramos a demo ao vivo para o seu nicho</li>
            <li className="flex gap-2"><span className="text-accent font-bold">4.</span> Bot ativo em até 5 dias úteis após aprovação</li>
          </ol>
        </div>

        <Link
          href="/"
          className="inline-block text-primary font-semibold hover:underline text-sm"
        >
          ← Voltar para o início
        </Link>
      </div>
    </main>
  )
}
