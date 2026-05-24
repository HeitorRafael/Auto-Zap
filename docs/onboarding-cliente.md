# 📋 Onboarding de Novo Cliente — AutoAtende

> Checklist completo para ativar um cliente do zero até bot funcionando.
> Tempo estimado: 3–5 dias úteis após reunião de coleta.

---

## FASE 1 — Reunião de coleta (1h)

### Informações obrigatórias a coletar

```
[ ] Nome da empresa
[ ] Nicho: Imobiliária / Restaurante / Clínica / MEI / Outro
[ ] Nome do responsável + cargo
[ ] Número WhatsApp Business (confirmar que é Business, não pessoal)
[ ] Horários de funcionamento completos
[ ] Nome do atendente humano para handoff
[ ] WhatsApp do dono para receber notificações de lead
```

### Base de conhecimento (pedir ao cliente)

```
[ ] Lista de serviços/produtos com preços (pode ser print do cardápio, site, etc.)
[ ] Perguntas que os clientes mais fazem (WhatsApp, balcão, etc.)
[ ] Política de cancelamento e formas de pagamento
[ ] Endereço completo e referências
[ ] Área de atuação (bairros, cidades)
```

**Para imobiliária:** portfólio de imóveis disponíveis (PDF ou link), regiões atendidas
**Para restaurante:** cardápio, horários de reserva, capacidade por turno
**Para clínica:** lista de procedimentos + valores, orientações pré-procedimento

---

## FASE 2 — Configurar infraestrutura (backend)

### 2.1 — Google Drive (base de conhecimento)
```bash
1. Acessar Google Drive com a conta do AutoAtende
2. Criar pasta: "AutoAtende - [NOME_CLIENTE]"
3. Criar arquivos .txt com as informações coletadas:
   - faq.txt
   - servicos.txt
   - horarios.txt
   - politicas.txt
   (+ cardapio.txt para restaurantes)
4. Compartilhar a pasta com a service account do Google
5. Anotar o ID da pasta (aparece na URL do Drive)
```

### 2.2 — Google Sheets (CRM de leads)
```bash
1. Criar planilha: "Leads AutoAtende - [NOME_CLIENTE]"
2. Criar aba "Leads" com as colunas:
   Data/Hora | Nome | Telefone | Intenção | Localização | Orçamento | Status
3. Criar aba "Relatórios" com:
   Data | Total Leads | Qualificados | Fechados | Conversão %
4. Compartilhar com a service account
5. Anotar o ID da planilha (aparece na URL)
```

### 2.3 — Evolution API (vincular WhatsApp)
```bash
# Via API ou painel Evolution
1. Criar instância com nome do cliente:
   POST /instance/create
   { "instanceName": "nome-cliente", "token": "...", "qrcode": true }

2. Escanear QR Code com o WhatsApp Business do cliente
   GET /instance/connect/nome-cliente
   (ou usar o painel em api.seudominio.com.br/manager)

3. Verificar conexão:
   GET /instance/connectionState/nome-cliente
   # deve retornar { "state": "open" }

4. Testar: enviar mensagem de teste para o próprio número
```

> ⚠️ IMPORTANTE: O cliente deve fazer isso com o WhatsApp Business no celular em mãos.
> Não funciona com WhatsApp Web aberto — feche antes de escanear.

### 2.4 — Chatwoot (painel de atendimento humano)
```bash
1. Acessar https://atende.seudominio.com.br
2. Criar conta para o cliente (Account → New Account)
3. Criar inbox do tipo "API":
   Settings → Inboxes → Add Inbox → API
   Nome: "WhatsApp [NOME_CLIENTE]"
4. Anotar o inbox_id (aparece no URL ao editar)
5. Adicionar o atendente humano do cliente como agente
6. Enviar link de acesso ao cliente
```

---

## FASE 3 — Configurar Typebot (fluxo conversacional)

```bash
1. Acessar https://flows.seudominio.com.br
2. Duplicar o template do nicho correspondente
3. Renomear: "[NOME_CLIENTE] - [Nicho]"
4. Substituir variáveis no fluxo:
   - {{NOME_IMOBILIARIA}} → nome real da empresa
   - {{LINK_PORTFOLIO}} → link do site/portfólio
   - {{NOME_RESTAURANTE}} → nome real
   - {{LINK_CARDAPIO}} → link ou "em breve"
   - {{NOME_CLINICA}} → nome real
   - {{LINK_TABELA_VALORES}} → link ou lista de preços
   - {{NOME_MEI}} → nome real
   - Horários estáticos na etapa de horários
5. Ajustar a URL do webhook para apontar para o n8n:
   https://n8n.seudominio.com.br/webhook/[nicho]-lead
6. Publicar o flow
7. Anotar o publicId (slug) do flow
```

---

## FASE 4 — Configurar n8n (automações)

```bash
1. Acessar https://n8n.seudominio.com.br
2. Para cada workflow já importado, criar uma versão do cliente:
   - Duplicar "lead-capture-sheets"
   - Ajustar:
     - SHEETS_ID_CLIENTE → ID da planilha criada no passo 2.2
     - TELEFONE_DONO → WhatsApp do dono da empresa
     - INSTANCE_NAME → nome da instância Evolution do cliente
3. Ativar os workflows do cliente
4. Testar: abrir o Typebot e completar o fluxo do início ao fim
5. Verificar se o lead apareceu no Google Sheets
6. Verificar se chegou notificação no WhatsApp do dono
```

---

## FASE 5 — Painel admin do cliente

```bash
# Gerar senha única para o cliente
# Na máquina local:
node -e "require('bcryptjs').hash('senhaForteAqui123!',10).then(console.log)"

# Salvar o hash gerado e configurar na Vercel:
# ADMIN_PASSWORD_HASH=<hash gerado>
# GOOGLE_SHEETS_ID=<ID da planilha do cliente>

# Enviar ao cliente:
# - URL: https://seudominio.com.br/admin
# - Senha: senhaForteAqui123! (orientar a anotar num lugar seguro)
```

---

## FASE 6 — Testes finais (checklist)

```bash
[ ] Typebot: completar o fluxo do início ao fim como cliente
[ ] Webhook: lead aparece no Google Sheets
[ ] Notificação: dono recebe WhatsApp com dados do lead
[ ] IA: fazer pergunta livre e receber resposta coerente
[ ] Handoff: clicar em "falar com atendente" e ver conversa no Chatwoot
[ ] Relatório: disparar manualmente o workflow daily-report e verificar WA
[ ] Painel: logar em /admin/leads e ver os leads capturados
[ ] SSL: todos os subdomínios com cadeado verde
[ ] Mobile: testar o Typebot no celular
```

---

## FASE 7 — Entrega ao cliente

### Mensagem de entrega (WhatsApp)
```
Olá, [NOME]! 🎉

O seu AutoAtende está no ar!

🤖 Seu bot:
👉 [link do Typebot personalizado]
(teste você mesmo como se fosse um cliente)

📊 Painel de leads:
👉 https://seudominio.com.br/admin
🔑 Senha: [senha gerada]

📋 Relatório semanal: toda segunda às 8h no seu WhatsApp

💬 Suporte: pode me chamar aqui mesmo no WhatsApp

Boas vendas! 🚀
```

### Documentos a entregar
- [ ] Link do painel + senha
- [ ] Link do bot para testar
- [ ] Planilha de leads (compartilhar no Drive)
- [ ] Contato de suporte

---

## Tempo por fase (referência)

| Fase | Tempo estimado |
|---|---|
| 1 — Reunião de coleta | 1h |
| 2 — Configurar infraestrutura | 1–2h |
| 3 — Typebot (fluxo) | 30–60min |
| 4 — n8n (automações) | 30–60min |
| 5 — Painel admin | 15min |
| 6 — Testes | 30min |
| **Total** | **4–6h de trabalho** |
