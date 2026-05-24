# 🚀 AutoAtende — Serviço de Automação de Atendimento via WhatsApp com IA
## Documento Completo de Especificação, Desenvolvimento e Deploy

> **Instrução para o Claude Code:** Leia este documento integralmente antes de escrever qualquer linha de código. Este arquivo é a fonte única de verdade do projeto. Siga a ordem das fases, respeite as decisões de stack e não improvise arquitetura sem justificativa explícita. Ao concluir cada fase, pergunte ao usuário se pode avançar.

---

## 📋 Índice

1. [Visão Geral do Negócio](#1-visão-geral-do-negócio)
2. [Stack Tecnológica Completa](#2-stack-tecnológica-completa)
3. [Estrutura de Pastas do Projeto](#3-estrutura-de-pastas-do-projeto)
4. [Fase 0 — Infraestrutura e VPS](#4-fase-0--infraestrutura-e-vps)
5. [Fase 1 — Instalação da Stack Docker](#5-fase-1--instalação-da-stack-docker)
6. [Fase 2 — Painel de Demonstração (Landing Page)](#6-fase-2--painel-de-demonstração-landing-page)
7. [Fase 3 — Fluxos de Automação no Typebot](#7-fase-3--fluxos-de-automação-no-typebot)
8. [Fase 4 — Orquestração com n8n](#8-fase-4--orquestração-com-n8n)
9. [Fase 5 — Integração com IA (RAG + LLM)](#9-fase-5--integração-com-ia-rag--llm)
10. [Fase 6 — Painel Administrativo do Cliente](#10-fase-6--painel-administrativo-do-cliente)
11. [Fase 7 — Deploy Final e Domínio](#11-fase-7--deploy-final-e-domínio)
12. [Fase 8 — Estratégia Comercial e Primeiro Cliente](#12-fase-8--estratégia-comercial-e-primeiro-cliente)
13. [Variáveis de Ambiente e Segredos](#13-variáveis-de-ambiente-e-segredos)
14. [Checklist de Segurança](#14-checklist-de-segurança)
15. [Modelo de Proposta Comercial](#15-modelo-de-proposta-comercial)
16. [FAQ para o Claude Code](#16-faq-para-o-claude-code)

---

## 1. Visão Geral do Negócio

### O que é o AutoAtende?
Um serviço B2B de assinatura mensal que entrega, para micro e pequenas empresas da Baixada Santista (Praia Grande, Santos, São Vicente), um sistema de atendimento automatizado no WhatsApp com triagem de leads por IA, qualificação automatizada e passagem para atendente humano quando necessário.

### Público-alvo prioritário (em ordem de facilidade de venda)
| Segmento | Cidade | Dor Principal |
|---|---|---|
| Imobiliárias e corretores autônomos | Praia Grande | Perda de leads fora do horário comercial |
| Restaurantes e bares | Santos (Gonzaga) | Triagem de reservas e dúvidas sem atendente |
| Clínicas de estética e beleza | Santos / São Vicente | Agendamentos perdidos, sem resposta no WA |
| MEIs e prestadores de serviço | São Vicente | Sem capacidade de pagar atendente fixo |

### Modelo de Receita
```
Setup (taxa única de configuração): R$ 1.500,00
Mensalidade (suporte + servidor): R$ 500,00/mês

Meta mínima: 8 clientes ativos = R$ 4.000,00/mês recorrentes
```

### O que o cliente recebe
- Chatbot de atendimento no WhatsApp da empresa dele (número dele)
- Fluxo de qualificação automático personalizado para o nicho
- IA que responde perguntas frequentes com base nos dados da empresa
- Painel web simples para acompanhar conversas e leads (Chatwoot)
- Repasse automático para humano quando necessário

---

## 2. Stack Tecnológica Completa

### Serviços Self-Hosted (instalados no VPS via Docker)
| Serviço | Função | Porta Interna |
|---|---|---|
| **Evolution API** | Bridge WhatsApp ↔ automação | 8080 |
| **Typebot Builder** | Editor visual de fluxos conversacionais | 3000 |
| **Typebot Viewer** | Renderizador público dos fluxos | 3001 |
| **n8n** | Orquestrador de automações e integrações | 5678 |
| **Chatwoot** | Painel de atendimento humano multicanal | 3002 |
| **PostgreSQL** | Banco de dados principal | 5432 |
| **Redis** | Cache e filas de mensagens | 6379 |
| **Nginx Proxy Manager** | Reverse proxy + SSL automático | 80/443 |

### Frontend (Landing Page + Painel Admin)
| Tecnologia | Justificativa |
|---|---|
| **Next.js 14** (App Router) | SSR para SEO, fácil deploy na Vercel |
| **Tailwind CSS** | Estilização rápida e responsiva |
| **shadcn/ui** | Componentes prontos e acessíveis |
| **Framer Motion** | Animações da landing page |

### Integrações Externas
| Serviço | Uso | Custo |
|---|---|---|
| **OpenAI GPT-4o-mini** | LLM para respostas da IA | Pay-per-use (~R$0,05/conversa) |
| **Google Sheets API** | CRM simples para leads | Gratuito |
| **Google Drive API** | Base de conhecimento RAG | Gratuito |
| **Vercel** | Deploy do frontend | Gratuito (hobby plan) |

### VPS Recomendado
- **Hostinger VPS KVM 2** ou **Contabo VPS S**
- Mínimo: 4 vCPU, 8GB RAM, 100GB SSD
- OS: Ubuntu 22.04 LTS
- Custo: R$ 30–60/mês
- Domínio: Registro.br (~R$ 40/ano) ou Namecheap

---

## 3. Estrutura de Pastas do Projeto

```
autoatende/
├── infra/                          # Toda infraestrutura Docker
│   ├── docker-compose.yml          # Stack completa
│   ├── docker-compose.override.yml # Overrides locais (não commitado)
│   ├── .env                        # Variáveis de ambiente (não commitado)
│   ├── nginx/
│   │   └── config/                 # Configs do Nginx Proxy Manager
│   └── scripts/
│       ├── install.sh              # Script de instalação completa no VPS
│       ├── backup.sh               # Backup automático dos volumes
│       └── update.sh               # Atualização dos containers
│
├── frontend/                       # Landing page + painel admin
│   ├── app/
│   │   ├── (marketing)/            # Landing page pública
│   │   │   ├── page.tsx            # Home
│   │   │   ├── como-funciona/      # Explicação do serviço
│   │   │   └── contato/            # Formulário de interesse
│   │   ├── (dashboard)/            # Área restrita do cliente
│   │   │   ├── layout.tsx
│   │   │   ├── leads/              # Tabela de leads capturados
│   │   │   ├── fluxo/              # Link para editar fluxo no Typebot
│   │   │   └── relatorio/          # Resumo mensal de atendimentos
│   │   └── api/
│   │       ├── leads/route.ts      # Recebe leads do n8n via webhook
│   │       └── contato/route.ts    # Formulário de interesse (email)
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── landing/                # Seções da landing page
│   │   │   ├── Hero.tsx
│   │   │   ├── ComoFunciona.tsx
│   │   │   ├── Segmentos.tsx
│   │   │   ├── Precos.tsx
│   │   │   ├── Depoimentos.tsx
│   │   │   └── CTA.tsx
│   │   └── dashboard/              # Componentes do painel
│   │       ├── LeadsTable.tsx
│   │       ├── StatsCards.tsx
│   │       └── ConversationFeed.tsx
│   ├── lib/
│   │   ├── sheets.ts               # Google Sheets API client
│   │   ├── evolution.ts            # Evolution API client
│   │   └── utils.ts
│   ├── public/
│   │   ├── logo.svg
│   │   ├── mockup-chat.png         # Print do chatbot em ação
│   │   └── og-image.png            # Open Graph para redes sociais
│   ├── .env.local                  # Variáveis locais (não commitado)
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
│
├── flows/                          # Fluxos exportados do Typebot (JSON)
│   ├── imobiliaria-praia-grande.json
│   ├── restaurante-santos.json
│   ├── clinica-estetica.json
│   └── mei-servicos-gerais.json
│
├── n8n-workflows/                  # Workflows exportados do n8n (JSON)
│   ├── lead-capture-sheets.json
│   ├── ai-responder.json
│   ├── human-handoff.json
│   └── daily-report.json
│
├── docs/                           # Documentação interna
│   ├── onboarding-cliente.md       # Passo a passo para novo cliente
│   ├── personalizar-fluxo.md       # Como customizar para cada nicho
│   └── troubleshooting.md
│
├── .gitignore
├── README.md
└── PROJETO_AUTOMACAO_WA.md        # Este arquivo
```

---

## 4. Fase 0 — Infraestrutura e VPS

> **Claude Code:** Nesta fase, gere apenas os scripts de shell. Não crie código de aplicação ainda.

### 4.1 Requisitos do VPS antes de começar
```bash
# Checklist inicial — rode no terminal do VPS após login como root
uname -a                    # Deve ser Ubuntu 22.04
free -h                     # Mínimo 8GB RAM
df -h                       # Mínimo 80GB livres em /
curl -V                     # curl deve estar disponível
```

### 4.2 Script de instalação inicial (`infra/scripts/install.sh`)
O Claude Code deve gerar este script completo com:
- Atualização do sistema (`apt update && apt upgrade -y`)
- Instalação do Docker Engine (não Docker Desktop) via script oficial
- Instalação do Docker Compose v2 (plugin, não standalone)
- Instalação do Nginx Proxy Manager via Docker
- Criação do usuário `autoatende` sem privilégios root mas com acesso ao Docker
- Configuração de firewall UFW (liberar portas 22, 80, 443 apenas)
- Instalação do `fail2ban` para proteção básica SSH
- Geração de diretório `/opt/autoatende` com permissões corretas

```bash
# Estrutura esperada após install.sh rodar com sucesso:
/opt/autoatende/
├── docker-compose.yml
├── .env
└── volumes/
    ├── postgres/
    ├── redis/
    ├── n8n/
    ├── typebot/
    ├── chatwoot/
    └── evolution/
```

### 4.3 Configuração de DNS
Após contratar o domínio, configurar os seguintes registros DNS (tipo A, apontando para o IP do VPS):
```
autoatende.com.br          → IP_DO_VPS   (landing page / Vercel CNAME)
api.autoatende.com.br      → IP_DO_VPS   (Evolution API)
flows.autoatende.com.br    → IP_DO_VPS   (Typebot Builder)
bot.autoatende.com.br      → IP_DO_VPS   (Typebot Viewer — público)
n8n.autoatende.com.br      → IP_DO_VPS   (n8n — acesso restrito)
atende.autoatende.com.br   → IP_DO_VPS   (Chatwoot)
```
> Observação: A landing page em Next.js será hospedada na Vercel gratuitamente. O domínio raiz aponta para a Vercel via CNAME, os subdomínios apontam para o VPS.

---

## 5. Fase 1 — Instalação da Stack Docker

> **Claude Code:** Gere o arquivo `infra/docker-compose.yml` completo e funcional. Use networks nomeadas, volumes nomeados e healthchecks. Nunca exponha portas diretamente para a internet — tudo passa pelo Nginx Proxy Manager.

### 5.1 `docker-compose.yml` — Serviços obrigatórios

O Claude Code deve gerar o compose com exatamente estes serviços, nesta ordem de dependência:

**1. Infraestrutura base**
```yaml
services:
  postgres:
    image: postgres:15-alpine
    # volumes, env vars para múltiplos databases (typebot, chatwoot, n8n)
    # healthcheck obrigatório

  redis:
    image: redis:7-alpine
    # password via env var
    # healthcheck obrigatório

  nginx-proxy-manager:
    image: jc21/nginx-proxy-manager:latest
    ports:
      - "80:80"
      - "443:443"
      - "81:81"  # painel admin NPM — bloquear depois
```

**2. Evolution API**
```yaml
  evolution-api:
    image: atendai/evolution-api:latest
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_healthy }
    environment:
      # DATABASE_URL, REDIS_URI, AUTHENTICATION_API_KEY
      # WEBHOOK_GLOBAL_URL apontando para n8n
```

**3. Typebot**
```yaml
  typebot-builder:
    image: baptistearno/typebot-builder:latest
    depends_on: [postgres]
    # NEXTAUTH_URL, DATABASE_URL, SMTP configs

  typebot-viewer:
    image: baptistearno/typebot-viewer:latest
    # NEXT_PUBLIC_VIEWER_URL
```

**4. n8n**
```yaml
  n8n:
    image: n8nio/n8n:latest
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_healthy }
    environment:
      # DB_TYPE=postgresdb, N8N_BASIC_AUTH_ACTIVE=true
      # WEBHOOK_URL, EXECUTIONS_DATA_SAVE_ON_SUCCESS
```

**5. Chatwoot**
```yaml
  chatwoot-app:
    image: chatwoot/chatwoot:latest
    depends_on: [postgres, redis]
    command: bundle exec rails s

  chatwoot-worker:
    image: chatwoot/chatwoot:latest
    command: bundle exec sidekiq
    depends_on: [chatwoot-app]
```

### 5.2 Variáveis de Ambiente Críticas
O Claude Code deve gerar o arquivo `.env.example` com todos os placeholders comentados. O arquivo `.env` real nunca entra no git.

### 5.3 Comandos de inicialização
```bash
# Primeira execução
cd /opt/autoatende
docker compose up -d postgres redis
sleep 30
docker compose up -d  # sobe o resto

# Verificar saúde
docker compose ps
docker compose logs -f n8n

# Resetar tudo (cuidado: apaga dados)
docker compose down -v
```

### 5.4 Nginx Proxy Manager — Configuração de cada subdomínio
Após subir, acessar `http://IP_VPS:81` e criar Proxy Hosts:
```
flows.autoatende.com.br   → typebot-builder:3000  (SSL Let's Encrypt)
bot.autoatende.com.br     → typebot-viewer:3001   (SSL Let's Encrypt)
api.autoatende.com.br     → evolution-api:8080    (SSL + Access List)
n8n.autoatende.com.br     → n8n:5678              (SSL + Access List)
atende.autoatende.com.br  → chatwoot-app:3000     (SSL Let's Encrypt)
```
> **Segurança:** n8n e Evolution API devem ter Access Lists configuradas no NPM para aceitar conexões apenas de IPs conhecidos ou via senha HTTP básica.

---

## 6. Fase 2 — Painel de Demonstração (Landing Page)

> **Claude Code:** Crie o projeto Next.js 14 completo em `frontend/`. Use App Router, Tailwind CSS, shadcn/ui e Framer Motion. O design deve ser moderno, sóbrio e transmitir confiança para o empresário local. Cor primária: `#0F4C81` (azul profissional). Cor de destaque: `#00C896` (verde tecnológico). Fonte: Inter.

### 6.1 Seções da Landing Page (em ordem)

#### `Hero.tsx`
- Headline: **"Seu WhatsApp atendendo clientes às 3h da manhã — sem você precisar responder"**
- Subheadline: Automação inteligente para imobiliárias, restaurantes e clínicas da Baixada Santista
- CTA primário: **"Quero uma demonstração gratuita"** → abre WhatsApp do AutoAtende
- CTA secundário: **"Ver como funciona"** → scroll suave para seção abaixo
- Visual: Mockup de celular com chat animado mostrando bot respondendo

#### `ProblemaSection.tsx`
- Título: **"Você perde clientes sem perceber"**
- 3 cards com ícones e estatísticas reais da pesquisa:
  - "82,4% das novas empresas de Praia Grande são MEIs — sem equipe para atender"
  - "Leads imobiliários que não recebem resposta em 5 minutos buscam outro corretor"
  - "Restaurantes perdem reservas fora do horário por falta de resposta no WhatsApp"

#### `ComoFunciona.tsx`
- Timeline visual com 4 etapas:
  1. Cliente envia mensagem no seu WhatsApp
  2. Bot qualifica automaticamente (o que precisa, orçamento, urgência)
  3. IA responde dúvidas com base nos seus dados
  4. Lead qualificado é passado para você fechar

#### `Segmentos.tsx`
- 3 cards clicáveis com ícones grandes:
  - 🏠 **Imobiliárias** — Triagem de perfil, envio de portfólio, agendamento de visita
  - 🍽️ **Restaurantes** — Reservas, cardápio, horários, promoções
  - ✂️ **Estética & Clínicas** — Agendamento, dúvidas de procedimentos, confirmação de consulta
- Cada card tem botão "Ver demonstração" que abre o Typebot Viewer com fluxo do nicho

#### `Precos.tsx`
- Dois planos lado a lado:
  - **Starter** — R$ 1.500 setup + R$ 500/mês — 1 número WA, 1 fluxo, relatório mensal
  - **Pro** — R$ 2.500 setup + R$ 800/mês — 2 números, fluxos ilimitados, painel de leads
- Selo de garantia: "30 dias ou devolvemos o setup"
- Nota: "Valores para Praia Grande, Santos e São Vicente. Consulte para outras cidades."

#### `Depoimentos.tsx`
- Placeholders para 3 depoimentos futuros (usar depoimentos reais dos primeiros clientes)
- Enquanto não tem clientes: substituir por "cases hipotéticos" claramente marcados como simulação ou remover a seção

#### `CTA.tsx`
- Fundo escuro com headline: **"Pronto para não perder mais um cliente?"**
- Formulário simples: Nome, WhatsApp, Segmento (dropdown), Cidade
- Ao enviar: webhook para n8n que notifica via WhatsApp ou email

### 6.2 Rotas do Next.js
```
/                     → Landing page completa
/demo/imobiliaria     → Redireciona para Typebot Viewer (fluxo imobiliária)
/demo/restaurante     → Redireciona para Typebot Viewer (fluxo restaurante)
/demo/estetica        → Redireciona para Typebot Viewer (fluxo estética)
/obrigado             → Página de confirmação pós-formulário
/admin                → Dashboard do cliente (protegido por auth simples)
```

### 6.3 SEO e Meta Tags
O Claude Code deve configurar no `layout.tsx` raiz:
```typescript
// metadata completo com:
// title: "AutoAtende | Automação de WhatsApp com IA para empresas da Baixada Santista"
// description com palavras-chave locais
// og:image apontando para /public/og-image.png (1200x630)
// robots: index, follow
// canonical URL
```

### 6.4 Deploy da Landing Page (Vercel)
```bash
# Na máquina local (não no VPS)
cd frontend
npx create-next-app@latest . --typescript --tailwind --app --src-dir=no --import-alias="@/*"
npx shadcn@latest init

# Instalar dependências extras
npm install framer-motion lucide-react @radix-ui/react-icons

# Deploy
npx vercel --prod
# Configurar variáveis de ambiente na Vercel dashboard
```

---

## 7. Fase 3 — Fluxos de Automação no Typebot

> **Claude Code:** Gere os arquivos JSON de exportação do Typebot para cada nicho. Os fluxos devem ser importáveis diretamente no Typebot Builder. Siga a estrutura de nodes do Typebot v2.

### 7.1 Fluxo Imobiliária (`flows/imobiliaria-praia-grande.json`)

**Objetivo:** Qualificar o interesse do lead antes de acionar o corretor.

```
Etapa 1 — Boas-vindas
  → "Olá! Sou o assistente virtual da [NOME_IMOBILIARIA]. 
     Vou te ajudar a encontrar o imóvel certo rapidinho! 🏠"

Etapa 2 — Intenção
  → Botões: [Quero Alugar] [Quero Comprar] [Tenho um imóvel para alugar/vender]

Etapa 3 — Localização (se alugar/comprar)
  → "Em qual região de Praia Grande você prefere?"
  → Lista: [Aviação] [Mirim] [Guilhermina] [Ocian] [Outro]

Etapa 4 — Perfil do imóvel
  → "Quantos dormitórios você procura?"
  → Botões: [Studio] [1 dorm] [2 dorm] [3 dorm+]

Etapa 5 — Orçamento
  → "Qual é seu orçamento mensal para aluguel?"
  → Botões: [até R$1.500] [R$1.500-2.500] [R$2.500-4.000] [acima de R$4.000]

Etapa 6 — Contato
  → "Ótimo! Para o nosso corretor entrar em contato, me passa seu nome:"
  → Input de texto → salva variável {{nome}}
  → "E seu WhatsApp (com DDD):"
  → Input de telefone → salva variável {{telefone}}

Etapa 7 — Webhook para n8n
  → POST para https://n8n.autoatende.com.br/webhook/imobiliaria-lead
  → Body: { nome, telefone, intencao, localizacao, dormitorios, orcamento, timestamp }

Etapa 8 — Encerramento
  → "Perfeito, {{nome}}! Nosso corretor já recebeu seus dados e vai te contatar 
     em breve pelo WhatsApp. Enquanto isso, veja nosso portfólio: [link]"
```

### 7.2 Fluxo Restaurante (`flows/restaurante-santos.json`)

```
Etapa 1 — Boas-vindas
  → "Olá! Aqui é o [NOME_RESTAURANTE] no Gonzaga. Como posso ajudar? 🍽️"

Etapa 2 — Menu principal
  → Botões: [Fazer Reserva] [Ver Cardápio] [Horários] [Falar com atendente]

Etapa 3a — Reserva
  → Data (input livre ou calendário)
  → Horário (lista: 12h / 13h / 19h / 20h / 21h)
  → Número de pessoas (botões: 1-2 / 3-4 / 5+ pessoas)
  → Nome para reserva → telefone → webhook n8n

Etapa 3b — Cardápio
  → Envia imagem/PDF do cardápio (URL configurável)
  → "Tem alguma dúvida sobre os pratos?" → loop para IA responder

Etapa 3c — Horários
  → Texto estático com horários de funcionamento (configurável no flow)

Etapa 3d — Atendente
  → Webhook para Chatwoot (handoff humano)
  → "Um momento, vou chamar nosso atendente..."
```

### 7.3 Fluxo Clínica/Estética (`flows/clinica-estetica.json`)

```
Etapa 1 — Boas-vindas
  → "Olá! Seja bem-vinda à [NOME_CLINICA]. Sou a assistente virtual. ✨"

Etapa 2 — Menu
  → Botões: [Agendar horário] [Ver procedimentos e valores] [Como me preparar?] [Falar com a equipe]

Etapa 3a — Agendamento
  → Procedimento (lista dos serviços cadastrados)
  → Data preferida (input)
  → Período: [Manhã] [Tarde]
  → Nome + telefone → webhook n8n → confirmar por WA

Etapa 3b — Procedimentos
  → Envia lista de procedimentos com valores (configurável)
  → Redireciona para agendamento

Etapa 3c — Preparação
  → IA responde com base no documento de orientações da clínica (RAG)
```

### 7.4 Fluxo MEI Genérico (`flows/mei-servicos-gerais.json`)
```
Etapa 1 → "Olá! Aqui é [NOME_MEI]. Como posso ajudar?"
Etapa 2 → Botões configuráveis pelo cliente: [Solicitar orçamento] [Ver serviços] [Horários] [Contato]
Etapa 3 → Coleta nome + serviço desejado + descrição → webhook n8n → notifica o MEI no WA dele
```

---

## 8. Fase 4 — Orquestração com n8n

> **Claude Code:** Gere os workflows n8n como arquivos JSON exportáveis. Cada workflow deve ter nodes bem nomeados, sem credenciais hardcoded (usar o sistema de credentials do n8n).

### 8.1 Workflow: Captura de Lead → Google Sheets (`n8n-workflows/lead-capture-sheets.json`)

```
Trigger: Webhook (POST /webhook/imobiliaria-lead)
  ↓
Node: Validar dados obrigatórios (nome + telefone não vazios)
  ↓
Node: Formatar telefone (remover caracteres especiais, garantir formato 55DDD9XXXXXXXX)
  ↓
Node: Google Sheets → Append Row
  - Planilha: "Leads AutoAtende - [NOME_CLIENTE]"
  - Campos: Data/Hora, Nome, Telefone, Intenção, Localização, Dormitórios, Orçamento, Status
  ↓
Node: Enviar notificação WhatsApp para o dono da empresa (via Evolution API)
  - Mensagem: "🏠 Novo lead! [Nome] quer [intenção] em [localização]. Tel: [telefone]"
  ↓
Node: Resposta HTTP 200 para o Typebot
```

### 8.2 Workflow: Resposta por IA (`n8n-workflows/ai-responder.json`)

```
Trigger: Webhook recebe mensagem livre (não está em fluxo Typebot)
  ↓
Node: Verificar se é pergunta (não comando de menu)
  ↓
Node: Buscar contexto do cliente (Google Drive → busca no documento de FAQ/cardápio/procedimentos)
  ↓
Node: Chamar OpenAI (GPT-4o-mini)
  - System prompt: "Você é o assistente da [EMPRESA]. Responda APENAS com base nas informações fornecidas. Se não souber, diga: 'Vou passar para nossa equipe te ajudar!' Seja breve e amigável."
  - User: mensagem do cliente + contexto recuperado
  ↓
Node: Enviar resposta via Evolution API
  ↓
Node: Se IA não souber → acionar handoff para Chatwoot
```

### 8.3 Workflow: Handoff Humano (`n8n-workflows/human-handoff.json`)

```
Trigger: Webhook recebe sinal de handoff (do Typebot ou da IA)
  ↓
Node: Criar conversa no Chatwoot via API
  - Contact: nome + telefone do lead
  - Inbox: inbox da empresa cliente
  - Mensagem inicial: contexto do que o cliente já respondeu no bot
  ↓
Node: Enviar WhatsApp para o atendente humano
  - "💬 Cliente [Nome] foi transferido para você no Chatwoot. Acesse: [link]"
  ↓
Node: Registrar handoff no Google Sheets (coluna Status → "Transferido")
```

### 8.4 Workflow: Relatório Diário (`n8n-workflows/daily-report.json`)

```
Trigger: Cron → toda segunda-feira às 8h
  ↓
Node: Ler Google Sheets → contar leads da semana
  ↓
Node: Calcular métricas (total leads, % qualificados, % transferidos)
  ↓
Node: Gerar mensagem de relatório formatada
  ↓
Node: Enviar para o dono da empresa via WhatsApp
  - "📊 Relatório semanal: X leads recebidos, Y qualificados, Z atendimentos humanos."
```

---

## 9. Fase 5 — Integração com IA (RAG + LLM)

> **Claude Code:** Implemente a lógica de RAG simples usando Google Drive como base de documentos e embeddings simples. Não use LangChain — implemente a busca diretamente via API para manter o projeto enxuto.

### 9.1 Estrutura da Base de Conhecimento (Google Drive)
Para cada cliente, criar pasta no Google Drive:
```
AutoAtende - [NOME_CLIENTE]/
├── faq.txt              # Perguntas frequentes e respostas
├── servicos.txt         # Lista de serviços/produtos com preços
├── horarios.txt         # Horários de funcionamento
├── politicas.txt        # Políticas de cancelamento, formas de pagamento
└── cardapio.txt         # (restaurantes) cardápio completo
```

### 9.2 Lógica de Busca no n8n (RAG Simplificado)
O fluxo n8n de IA deve:
1. Ler todos os arquivos `.txt` da pasta do cliente no Drive
2. Concatenar o conteúdo (limitado a 8.000 tokens)
3. Enviar como contexto no system prompt do GPT-4o-mini
4. Instrução explícita para não inventar informações

```javascript
// Exemplo do Code node no n8n
const clientContext = items[0].json.driveContent;
const userMessage = items[0].json.customerMessage;

const systemPrompt = `
Você é o assistente virtual da empresa "${clientName}".
Responda APENAS com base nas informações abaixo.
Se a pergunta não puder ser respondida com essas informações, 
responda: "Vou verificar isso com nossa equipe e te retorno em breve! 😊"
Seja direto, amigável e use no máximo 3 frases.

INFORMAÇÕES DA EMPRESA:
${clientContext}
`;

return [{ json: { systemPrompt, userMessage } }];
```

### 9.3 Controle de Custos
- Usar GPT-4o-mini (não GPT-4o) → ~10x mais barato
- Limitar contexto a 8.000 tokens por chamada
- Cache de respostas no Redis para perguntas idênticas (TTL: 1h)
- Log de uso por cliente no Google Sheets para faturamento futuro

---

## 10. Fase 6 — Painel Administrativo do Cliente

> **Claude Code:** Crie o dashboard em `frontend/app/(dashboard)/`. Use autenticação simples por senha (sem OAuth complexo por enquanto). O painel deve mostrar os dados do Google Sheets do cliente de forma visual.

### 10.1 Telas do Painel

#### `/admin` — Login
- Campo: senha do cliente (gerada na contratação)
- Armazenada em cookie httpOnly

#### `/admin/leads` — Tabela de Leads
- Tabela com colunas: Data, Nome, Telefone, Interesse, Status
- Status com badges coloridos: 🟡 Novo / 🔵 Em atendimento / 🟢 Fechado / 🔴 Perdido
- Botão "Abrir no WhatsApp" → `wa.me/55DDD9XXXXXXXX`
- Exportar CSV

#### `/admin/relatorio` — Resumo Mensal
- Cards com métricas: Total leads / Qualificados / Fechados / Taxa de conversão
- Gráfico de barras: leads por dia da semana
- Gráfico de pizza: origem (WhatsApp / Instagram / site)

#### `/admin/configuracoes` — Configurações básicas
- Alterar horários de funcionamento (salva no Drive)
- Upload de cardápio/portfólio/FAQ atualizado
- Testar bot (link para o fluxo Typebot)

### 10.2 Autenticação Simples
```typescript
// lib/auth.ts
// Senha hasheada com bcrypt, armazenada em variável de ambiente
// Sem banco de dados — o cliente tem uma senha por contrato
// Implementar rate limiting: máximo 5 tentativas por IP em 15 minutos
```

---

## 11. Fase 7 — Deploy Final e Domínio

> **Claude Code:** Gere os scripts e arquivos de configuração necessários para o deploy final. Não use serviços pagos além do VPS e do domínio já contratados.

### 11.1 Checklist pré-deploy
```bash
# No VPS
docker compose ps             # todos os serviços "healthy"
docker compose logs --tail=50 evolution-api   # sem erros
curl https://api.autoatende.com.br/health     # retorna 200
curl https://flows.autoatende.com.br          # Typebot carrega
curl https://atende.autoatende.com.br         # Chatwoot carrega
```

### 11.2 Configuração de SSL (automático via NPM)
O Nginx Proxy Manager gera certificados Let's Encrypt automaticamente para todos os subdomínios. Habilitar "Force HTTPS" e "HTTP/2" em cada Proxy Host.

### 11.3 Backup automático (`infra/scripts/backup.sh`)
```bash
#!/bin/bash
# Roda via cron todo dia às 3h (crontab -e)
# 0 3 * * * /opt/autoatende/scripts/backup.sh

BACKUP_DIR="/opt/autoatende/backups/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# Dump do PostgreSQL
docker exec autoatende-postgres pg_dumpall -U postgres > "$BACKUP_DIR/postgres.sql"

# Backup dos volumes do n8n e Typebot
tar czf "$BACKUP_DIR/n8n-data.tar.gz" /opt/autoatende/volumes/n8n/
tar czf "$BACKUP_DIR/typebot-data.tar.gz" /opt/autoatende/volumes/typebot/

# Manter apenas últimos 7 backups
find /opt/autoatende/backups -maxdepth 1 -type d -mtime +7 -exec rm -rf {} +

echo "Backup concluído: $BACKUP_DIR"
```

### 11.4 Deploy do Frontend (Vercel)
```bash
# Conectar repositório GitHub à Vercel
# Configurar variáveis de ambiente na Vercel:
# NEXT_PUBLIC_TYPEBOT_IMOBILIARIA_ID=xxx
# NEXT_PUBLIC_TYPEBOT_RESTAURANTE_ID=xxx
# NEXT_PUBLIC_WHATSAPP_CONTATO=5513XXXXXXXXX
# N8N_WEBHOOK_URL=https://n8n.autoatende.com.br/webhook/contato
# GOOGLE_SHEETS_API_KEY=xxx
# GOOGLE_SHEETS_ID=xxx
```

### 11.5 Monitoramento básico (gratuito)
- **UptimeRobot** — monitora todos os subdomínios e envia alerta no WhatsApp se cair
- **Grafana/Prometheus** — adiar para v2 do projeto; não implementar agora

---

## 12. Fase 8 — Estratégia Comercial e Primeiro Cliente

> **Claude Code:** Esta fase não envolve código. Gere os documentos de texto necessários dentro de `docs/`.

### 12.1 Extração de Leads Locais (processo manual diário)

**Ferramenta:** Instant Data Scraper (extensão Chrome) no Google Maps

**Palavras-chave para pesquisar:**
```
"imobiliária Praia Grande"
"corretor de imóveis Praia Grande"
"restaurante Gonzaga Santos"
"clínica de estética Santos"
"salão de beleza Santos"
"clínica estética São Vicente"
```

**Planilha de leads (Google Sheets):**
```
Colunas: Nome empresa | Telefone | Responsável | Instagram | Nota Google | Nº avaliações | Tempo resposta WA | Status abordagem | Data contato | Resultado
```

**Filtro de prioridade — abordar primeiro quem tem:**
- Nota Google < 4.0 com reclamações sobre "demora no atendimento" ou "não responde"
- Instagram ativo mas sem resposta nas DMs
- WhatsApp Business configurado mas sem mensagem automática

### 12.2 Roteiro de Abordagem via WhatsApp

**Mensagem Dia 1 (primeira abordagem):**
```
Olá, [Nome]! Tudo bem?

Sou o [Seu Nome], da AutoAtende. Analisei os canais da [Nome da Empresa] e 
notei uma oportunidade de aumentar o retorno dos seus contatos no WhatsApp.

Criei uma demonstração personalizada pra vocês — dá pra testar agora mesmo:
👉 bot.autoatende.com.br/demo/[slug-da-empresa]

O que você acha? Posso explicar como isso se encaixa na rotina de vocês?
```

**Mensagem Dia 3 (follow-up se não respondeu):**
```
[Nome], deixo apenas esse retorno rápido.

Essa semana notei que [empresa concorrente] na região já usa automação de atendimento.
A ferramenta que montei pra vocês pode qualificar os leads que chegam fora do 
horário comercial automaticamente.

Quer 15 minutos de call essa semana pra mostrar ao vivo? 📱
```

**Mensagem Dia 7 (último contato da sequência):**
```
[Nome], não quero insistir além do necessário.

Se em algum momento fizer sentido revisar o atendimento digital da [Empresa], 
pode me chamar aqui.

Deixo o link da demonstração salvo aqui pra consultar quando quiser:
👉 autoatende.com.br/demo/[nicho]

Abraço! 🤝
```

### 12.3 Personalização do Protótipo por Lead

Antes de enviar a abordagem, personalizar o Typebot com:
1. Acessar `flows.autoatende.com.br`
2. Duplicar o fluxo template do nicho
3. Substituir `[NOME_EMPRESA]` pelo nome real
4. Trocar logo/cor principal pelas cores do Instagram da empresa
5. Publicar com slug personalizado: `bot.autoatende.com.br/[nome-empresa-pg]`
6. Registrar slug na planilha de leads

### 12.4 Funil de Vendas Esperado

```
100 leads pesquisados no Maps
  ↓ filtro por dor visível
40 leads qualificados → prótotipo personalizado criado
  ↓ abordagem WA + demo
10 respondem com interesse
  ↓ call de apresentação
4 pedem proposta formal
  ↓ proposta + follow-up
2 fecham contrato no primeiro mês ✅

Receita mês 1: 2 × (R$1.500 + R$500) = R$ 4.000,00
Receita mês 2 em diante: R$ 1.000,00 recorrentes (+ novos clientes)
```

---

## 13. Variáveis de Ambiente e Segredos

> **Claude Code:** Nunca hardcode nenhuma das variáveis abaixo. Sempre usar `process.env.NOME_DA_VARIAVEL`. Gerar o arquivo `.env.example` com todos os campos e descrições.

```env
# === VPS / INFRAESTRUTURA ===
VPS_IP=                          # IP público do servidor

# === BANCO DE DADOS ===
POSTGRES_PASSWORD=               # Senha forte gerada com openssl rand -base64 32
POSTGRES_DB_TYPEBOT=typebot
POSTGRES_DB_CHATWOOT=chatwoot
POSTGRES_DB_N8N=n8n

# === REDIS ===
REDIS_PASSWORD=                  # Senha forte

# === EVOLUTION API ===
EVOLUTION_API_KEY=               # Chave de autenticação da API

# === TYPEBOT ===
TYPEBOT_ENCRYPTION_SECRET=       # openssl rand -base64 32
NEXTAUTH_SECRET=                 # openssl rand -base64 32
SMTP_HOST=                       # Para envio de emails do Typebot
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# === N8N ===
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=         # Senha forte
N8N_ENCRYPTION_KEY=              # openssl rand -base64 32

# === CHATWOOT ===
CHATWOOT_SECRET_KEY_BASE=        # openssl rand -hex 64

# === OPENAI ===
OPENAI_API_KEY=                  # sk-...

# === GOOGLE APIS ===
GOOGLE_SHEETS_API_KEY=
GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON= # JSON da service account (em uma linha)

# === FRONTEND (Next.js) ===
NEXT_PUBLIC_TYPEBOT_IMOBILIARIA_ID=
NEXT_PUBLIC_TYPEBOT_RESTAURANTE_ID=
NEXT_PUBLIC_TYPEBOT_ESTETICA_ID=
NEXT_PUBLIC_WHATSAPP_CONTATO=    # 5513XXXXXXXXX (sem + e sem espaços)
ADMIN_PASSWORD_HASH=             # bcrypt hash da senha do painel
```

---

## 14. Checklist de Segurança

Antes de onboarding do primeiro cliente, verificar:

- [ ] Painel do Nginx Proxy Manager (porta 81) bloqueado por firewall após configuração
- [ ] n8n acessível apenas com Basic Auth habilitado
- [ ] Evolution API com `AUTHENTICATION_API_KEY` forte
- [ ] Todos os containers rodando sem `privileged: true`
- [ ] Nenhuma porta interna exposta diretamente (apenas 80/443/22 no UFW)
- [ ] `.env` no `.gitignore` e nunca commitado
- [ ] Backups funcionando (verificar arquivo gerado no dia seguinte)
- [ ] SSL válido em todos os subdomínios (verificar no SSL Labs)
- [ ] fail2ban ativo (`sudo systemctl status fail2ban`)
- [ ] Senhas do painel admin geradas individualmente por cliente
- [ ] Dados dos leads armazenados apenas no Google Sheets do cliente (não no servidor)
- [ ] Consentimento de uso de dados mencionado na primeira mensagem do bot ("Ao continuar, você concorda com nossa política de privacidade.")

---

## 15. Modelo de Proposta Comercial

> Gerar como `docs/proposta-template.md` — o Claude Code deve criar este arquivo preenchível.

```markdown
# Proposta de Automação de Atendimento WhatsApp
**Para:** [Nome da Empresa]  
**Preparada por:** AutoAtende  
**Data:** [DATA]  
**Validade:** 15 dias

## O que identificamos
Ao analisar os canais de atendimento da [EMPRESA], identificamos:
- [PROBLEMA ESPECÍFICO ENCONTRADO NA AUDITORIA]
- Estimativa de [X] leads perdidos por semana fora do horário comercial

## O que vamos entregar
- Chatbot de atendimento ativo 24h no WhatsApp da empresa
- Qualificação automática de leads com [X] perguntas estruturadas
- IA que responde dúvidas sobre [SERVIÇOS/PRODUTOS]
- Painel web para acompanhar todos os atendimentos
- Relatório semanal automático via WhatsApp
- Suporte técnico por WhatsApp em horário comercial

## Investimento
| Item | Valor |
|---|---|
| Configuração inicial (setup único) | R$ 1.500,00 |
| Manutenção mensal (a partir do 2º mês) | R$ 500,00/mês |

## Garantia
Se em 30 dias você não perceber melhora no atendimento, devolvemos o valor do setup integralmente.

## Próximos passos
1. Aprovação desta proposta
2. Pagamento do setup via PIX
3. Reunião de 1h para coleta de informações da empresa
4. Bot ativo em até 5 dias úteis

**PIX para pagamento:** [CHAVE PIX]  
**Dúvidas:** [WHATSAPP]
```

---

## 16. FAQ para o Claude Code

**P: Posso usar outra stack ao invés dessa?**  
R: Não sem aprovação explícita. A stack foi escolhida por custo, comunidade e facilidade de manutenção pelo dono do projeto.

**P: Posso usar LangChain para o RAG?**  
R: Não. Usar chamada direta à API da OpenAI com contexto injetado no system prompt, conforme descrito na Fase 5.

**P: Posso usar banco de dados diferente do PostgreSQL?**  
R: Não. Chatwoot e n8n dependem de PostgreSQL nativamente.

**P: Como lidar com multi-tenancy (múltiplos clientes)?**  
R: Cada cliente tem uma instância do Typebot, uma aba no Google Sheets, uma inbox no Chatwoot e um número no Evolution API. A infra é compartilhada no VPS.

**P: O que fazer se o Evolution API banir o número do cliente?**  
R: Documentar no troubleshooting: usar WhatsApp Business legítimo, não enviar mensagens em massa sem opt-in, limitar a 50 mensagens/dia no início.

**P: Qual a ordem de desenvolvimento?**  
R: Fase 0 → 1 → (validar stack funcionando) → 3 → 4 → 2 → 5 → 6 → 7  
Ou seja: infra primeiro, fluxos depois, frontend por último.

**P: Preciso de aprovação do usuário entre fases?**  
R: Sim. Ao concluir cada fase, pause e liste o que foi feito + o que vem a seguir. Pergunte se pode prosseguir.

---

## 🎯 Definição de Pronto (MVP)

O projeto está pronto para o primeiro cliente quando:

- [ ] Stack Docker rodando estável há 48h no VPS
- [ ] Pelo menos 1 fluxo Typebot funcional para o nicho alvo
- [ ] Workflow n8n de captura de lead para Google Sheets funcionando
- [ ] Notificação WhatsApp para o dono da empresa funcionando
- [ ] Handoff para Chatwoot funcionando
- [ ] Landing page no ar com CTA de WhatsApp
- [ ] Pelo menos 1 demo personalizada criada para lead específico
- [ ] Backup automático configurado e testado

---

*Documento criado para uso exclusivo no desenvolvimento do projeto AutoAtende.*  
*Versão 1.0 — Baseado em análise de mercado da Baixada Santista (Santos, Praia Grande e São Vicente).*
```
