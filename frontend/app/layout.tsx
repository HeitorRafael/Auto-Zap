import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AutoAtende | Automação de WhatsApp com IA para empresas da Baixada Santista',
  description:
    'Chatbot inteligente para imobiliárias, restaurantes e clínicas de Praia Grande, Santos e São Vicente. Atenda clientes 24h no WhatsApp sem precisar responder manualmente.',
  keywords: [
    'automação whatsapp', 'chatbot whatsapp', 'atendimento automatico',
    'imobiliaria praia grande', 'restaurante santos', 'clinica estetica sao vicente',
    'bot whatsapp baixada santista', 'atendimento ia whatsapp',
  ],
  authors: [{ name: 'AutoAtende' }],
  creator: 'AutoAtende',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://autoatende.com.br',
    siteName: 'AutoAtende',
    title: 'AutoAtende | Seu WhatsApp atendendo às 3h da manhã',
    description:
      'Automação inteligente de atendimento no WhatsApp para micro e pequenas empresas da Baixada Santista.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AutoAtende' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoAtende | Automação de WhatsApp com IA',
    description: 'Chatbot inteligente para empresas da Baixada Santista.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: 'https://autoatende.com.br' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  )
}
