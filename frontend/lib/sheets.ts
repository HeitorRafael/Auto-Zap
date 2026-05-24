// Cliente Google Sheets API v4 — REST direto, sem dependências externas

export type Lead = {
  dataHora:    string
  nome:        string
  telefone:    string
  intencao:    string
  localizacao: string
  orcamento:   string
  status:      'Novo' | 'Em atendimento' | 'Fechado' | 'Perdido' | 'Transferido'
}

const SHEETS_ID  = process.env.GOOGLE_SHEETS_ID ?? ''
const SHEETS_KEY = process.env.GOOGLE_SHEETS_API_KEY ?? ''
const RANGE      = 'Leads!A2:H'

export async function getLeads(): Promise<Lead[]> {
  if (!SHEETS_ID || !SHEETS_KEY) {
    console.warn('GOOGLE_SHEETS_ID ou GOOGLE_SHEETS_API_KEY não configurados — retornando mock')
    return getMockLeads()
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${encodeURIComponent(RANGE)}?key=${SHEETS_KEY}`
    const res  = await fetch(url, { next: { revalidate: 60 } }) // cache 60s

    if (!res.ok) throw new Error(`Sheets API: ${res.status}`)

    const data = await res.json()
    const rows: string[][] = data.values ?? []

    return rows.map((row) => ({
      dataHora:    row[0] ?? '',
      nome:        row[1] ?? '',
      telefone:    row[2] ?? '',
      intencao:    row[3] ?? '',
      localizacao: row[4] ?? '',
      orcamento:   row[5] ?? '',
      status:      (row[7] as Lead['status']) ?? 'Novo',
    }))
  } catch (err) {
    console.error('Erro ao buscar leads do Sheets:', err)
    return getMockLeads()
  }
}

export function calcMetrics(leads: Lead[]) {
  const total        = leads.length
  const qualificados = leads.filter(l => l.status !== 'Novo').length
  const fechados     = leads.filter(l => l.status === 'Fechado').length
  const transferidos = leads.filter(l => l.status === 'Transferido').length
  const perdidos     = leads.filter(l => l.status === 'Perdido').length
  const conversao    = total > 0 ? ((fechados / total) * 100).toFixed(1) : '0'

  // Leads por dia da semana
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const porDia: Record<string, number> = Object.fromEntries(dias.map(d => [d, 0]))

  leads.forEach(l => {
    if (!l.dataHora) return
    const parts = l.dataHora.split(' ')[0]?.split('/')
    if (!parts || parts.length < 3) return
    const d = new Date(+parts[2], +parts[1] - 1, +parts[0])
    const dia = dias[d.getDay()]
    if (dia) porDia[dia]++
  })

  return { total, qualificados, fechados, transferidos, perdidos, conversao, porDia }
}

// ─── Dados mock para desenvolvimento sem credenciais ─────────────────────────
function getMockLeads(): Lead[] {
  return [
    { dataHora: '23/05/2026 09:12', nome: 'Carlos Souza',    telefone: '5513991112233', intencao: 'Quero Alugar',  localizacao: 'Aviação',    orcamento: 'R$1.500-2.500', status: 'Fechado'       },
    { dataHora: '23/05/2026 11:45', nome: 'Ana Paula',       telefone: '5513987654321', intencao: 'Quero Comprar', localizacao: 'Mirim',      orcamento: 'Acima R$4.000', status: 'Em atendimento'},
    { dataHora: '22/05/2026 14:30', nome: 'Ricardo Lima',    telefone: '5513998877665', intencao: 'Quero Alugar',  localizacao: 'Guilhermina',orcamento: 'Até R$1.500',  status: 'Novo'          },
    { dataHora: '22/05/2026 16:00', nome: 'Fernanda Costa',  telefone: '5513977665544', intencao: 'Quero Comprar', localizacao: 'Ocian',      orcamento: 'R$2.500-4.000', status: 'Transferido'   },
    { dataHora: '21/05/2026 10:20', nome: 'Marcos Pereira',  telefone: '5513966554433', intencao: 'Quero Alugar',  localizacao: 'Aviação',    orcamento: 'R$1.500-2.500', status: 'Perdido'       },
    { dataHora: '21/05/2026 18:55', nome: 'Julia Martins',   telefone: '5513955443322', intencao: 'Tenho imóvel',  localizacao: 'Mirim',      orcamento: '',             status: 'Novo'          },
    { dataHora: '20/05/2026 08:10', nome: 'Pedro Alves',     telefone: '5513944332211', intencao: 'Quero Alugar',  localizacao: 'Guilhermina',orcamento: 'R$1.500-2.500', status: 'Fechado'       },
  ]
}
