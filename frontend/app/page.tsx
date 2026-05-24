import Hero            from '@/components/landing/Hero'
import ProblemaSection from '@/components/landing/ProblemaSection'
import ComoFunciona    from '@/components/landing/ComoFunciona'
import Segmentos       from '@/components/landing/Segmentos'
import Precos          from '@/components/landing/Precos'
import Depoimentos     from '@/components/landing/Depoimentos'
import CTA             from '@/components/landing/CTA'

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <ProblemaSection />
      <ComoFunciona />
      <Segmentos />
      <Precos />
      <Depoimentos />
      <CTA />

      {/* Footer minimalista */}
      <footer className="bg-neutral-900 text-white/50 text-sm text-center py-6 px-4">
        <p>© {new Date().getFullYear()} AutoAtende · Praia Grande, Santos e São Vicente · SP</p>
        <p className="mt-1">
          <a href="#" className="hover:text-white/80 transition-colors">Política de Privacidade</a>
          {' · '}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_CONTATO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/80 transition-colors"
          >
            WhatsApp
          </a>
        </p>
      </footer>
    </main>
  )
}
