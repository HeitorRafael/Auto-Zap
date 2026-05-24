import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nome, whatsapp, segmento, cidade } = body

    if (!nome || !whatsapp || !segmento || !cidade) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const n8nUrl = process.env.N8N_WEBHOOK_URL
    if (!n8nUrl) {
      console.error('N8N_WEBHOOK_URL não configurada')
      return NextResponse.json({ error: 'Configuração interna' }, { status: 500 })
    }

    const payload = {
      nome,
      whatsapp: whatsapp.replace(/\D/g, ''),
      segmento,
      cidade,
      origem: 'landing-page',
      timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    }

    const n8nRes = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!n8nRes.ok) {
      console.error('Erro ao notificar n8n:', n8nRes.status)
      return NextResponse.json({ error: 'Erro ao processar' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Erro na rota /api/contato:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
