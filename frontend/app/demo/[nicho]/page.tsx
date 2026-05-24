import { redirect } from 'next/navigation'

const TYPEBOT_IDS: Record<string, string | undefined> = {
  imobiliaria: process.env.NEXT_PUBLIC_TYPEBOT_IMOBILIARIA_ID,
  restaurante:  process.env.NEXT_PUBLIC_TYPEBOT_RESTAURANTE_ID,
  estetica:     process.env.NEXT_PUBLIC_TYPEBOT_ESTETICA_ID,
}

const VIEWER_URL = process.env.NEXT_PUBLIC_TYPEBOT_VIEWER_URL ?? 'https://bot.autoatende.com.br'

export default function DemoPage({ params }: { params: { nicho: string } }) {
  const typebotId = TYPEBOT_IDS[params.nicho]

  if (!typebotId) {
    redirect('/')
  }

  redirect(`${VIEWER_URL}/${typebotId}`)
}
