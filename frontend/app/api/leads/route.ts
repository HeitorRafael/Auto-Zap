/**
 * POST /api/leads
 * Recebe leads do n8n e armazena em memória temporária (fallback).
 * O armazenamento primário é o Google Sheets — esse endpoint serve como
 * receptor de webhook do n8n para notificações em tempo real.
 */
import { NextRequest, NextResponse } from 'next/server'

// Validação de origem — só aceita chamadas do n8n
function validateOrigin(req: NextRequest): boolean {
  const secret = req.headers.get('x-webhook-secret')
  return secret === process.env.WEBHOOK_SECRET
}

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let lead: Record<string, string>
  try { lead = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const required = ['nome', 'telefone']
  const missing  = required.filter(k => !lead[k])
  if (missing.length > 0) {
    return NextResponse.json({ error: `Campos obrigatórios: ${missing.join(', ')}` }, { status: 400 })
  }

  // Log do lead recebido (em produção, persistir no Sheets via n8n)
  console.log('[Lead recebido]', {
    ...lead,
    receivedAt: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true, message: 'Lead recebido' })
}
