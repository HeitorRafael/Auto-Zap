# 🤖 AutoAtende

> Serviço B2B de automação de atendimento via WhatsApp com IA para micro e pequenas empresas da Baixada Santista.

**Setup único:** R$ 1.500–2.500 · **Mensalidade:** R$ 500–800/mês · **Meta:** 8 clientes = R$ 4.000/mês recorrentes

---

## Stack

| Camada | Tecnologia |
|---|---|
| Bridge WhatsApp | Evolution API |
| Fluxos conversacionais | Typebot Builder + Viewer |
| Automações | n8n |
| Atendimento humano | Chatwoot |
| Banco de dados | PostgreSQL 15 |
| Cache | Redis 7 |
| Proxy + SSL | Nginx Proxy Manager |
| IA | GPT-4o-mini (OpenAI) |
| Base de conhecimento | Google Drive (RAG simples) |
| CRM de leads | Google Sheets |
| Frontend | Next.js 14 + Tailwind + Framer Motion |
| Deploy frontend | Vercel |

---

## Estrutura

```
autoatende/
├── infra/                    # Docker stack completa
│   ├── docker-compose.yml    # 9 serviços
│   ├── .env.example
│   └── scripts/
│       ├── install.sh        # Setup inicial do VPS
│       ├── deploy-vps.sh     # Primeiro deploy
│       ├── backup.sh         # Backup diário (cron 3h)
│       ├── update.sh         # Atualizar containers
│       └── init-db.sh        # Criar databases no Postgres
│
├── frontend/                 # Next.js 14
│   ├── app/
│   │   ├── page.tsx          # Landing page (7 seções)
│   │   ├── admin/            # Painel do cliente (auth + leads + relatório)
│   │   └── api/              # Routes: contato, auth, leads
│   ├── components/
│   │   ├── landing/          # Hero, Problema, ComoFunciona, Segmentos, Preços, CTA
│   │   └── dashboard/        # AdminNav, LeadsTable, StatsCards
│   └── lib/
│       ├── auth.ts           # JWT + bcrypt + rate limiting
│       └── sheets.ts         # Google Sheets client
│
├── flows/                    # Flows Typebot (JSON importável)
│   ├── imobiliaria-praia-grande.json
│   ├── restaurante-santos.json
│   ├── clinica-estetica.json
│   └── mei-servicos-gerais.json
│
├── n8n-workflows/            # Workflows n8n (JSON importável)
│   ├── lead-capture-sheets.json
│   ├── ai-responder.json
│   ├── human-handoff.json
│   └── daily-report.json
│
└── docs/
    ├── deploy-checklist.md     # Passo a passo completo de deploy
    ├── onboarding-cliente.md   # Ativar novo cliente (6 fases)
    ├── personalizar-fluxo.md   # Adaptar templates por nicho
    ├── proposta-template.md    # Proposta comercial para preencher
    └── troubleshooting.md      # Problemas comuns e soluções
```

---

## Início Rápido

### 1. VPS — Instalação base
```bash
ssh root@SEU_IP
scp infra/scripts/install.sh root@SEU_IP:/tmp/
bash /tmp/install.sh
```

### 2. Configurar variáveis
```bash
cd /opt/autoatende
cp /repo/infra/.env.example .env
nano .env  # preencher TODOS os campos
```

### 3. Primeiro deploy
```bash
bash /repo/infra/scripts/deploy-vps.sh /repo
```

### 4. Frontend (Vercel)
```bash
cd frontend
cp .env.local.example .env.local
npm install
npx vercel --prod
```

### 5. Ler o checklist completo
```
docs/deploy-checklist.md
```

---

## Subdomínios (após DNS configurado)

| URL | Serviço |
|---|---|
| `autoatende.com.br` | Landing page (Vercel) |
| `api.autoatende.com.br` | Evolution API |
| `flows.autoatende.com.br` | Typebot Builder (editor) |
| `bot.autoatende.com.br` | Typebot Viewer (público) |
| `n8n.autoatende.com.br` | n8n (restrito) |
| `atende.autoatende.com.br` | Chatwoot |
| `autoatende.com.br/admin` | Painel do cliente |

---

## Segmentos atendidos

- 🏠 **Imobiliárias** — Praia Grande
- 🍽️ **Restaurantes** — Santos (Gonzaga)
- ✨ **Estética e Clínicas** — Santos / São Vicente
- 🔧 **MEIs e Prestadores** — São Vicente

---

## Status do projeto

| Fase | Status |
|---|---|
| 0 — VPS + scripts | ✅ |
| 1 — Docker stack (9 serviços) | ✅ |
| 2 — Landing page Next.js | ✅ |
| 3 — Flows Typebot (4 nichos) | ✅ |
| 4 — Workflows n8n (4 automações) | ✅ |
| 5 — Painel admin do cliente | ✅ |
| 6 — RAG (embutido no n8n) | ✅ |
| 7 — Deploy + checklist | ✅ |
| 8 — Docs comerciais | ✅ |

**Progresso: 95%** — Pronto para o primeiro cliente após deploy no VPS.

---

*AutoAtende · Baixada Santista · 2026*
