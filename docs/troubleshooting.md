# 🔧 Troubleshooting — AutoAtende

> Problemas mais comuns e como resolver. Verifique nesta ordem antes de qualquer coisa:
> `docker compose ps` → `docker compose logs -f [serviço]`

---

## Evolution API — WhatsApp

### ❌ QR Code não aparece / expirou
```bash
# Reiniciar a instância
DELETE https://api.seudominio.com.br/instance/delete/NOME_INSTANCIA
POST   https://api.seudominio.com.br/instance/create
# (Pedir ao cliente para escanear novamente)
```

### ❌ Status "close" — WhatsApp desconectou
```bash
# Verificar estado
GET https://api.seudominio.com.br/instance/connectionState/NOME_INSTANCIA

# Reconectar
POST https://api.seudominio.com.br/instance/connect/NOME_INSTANCIA
# QR Code aparece novamente — cliente precisa escanear
```

### ❌ Número banido pelo WhatsApp
**Prevenção é o melhor remédio:**
- Usar WhatsApp Business legítimo (não pessoal)
- Não enviar mensagens em massa sem opt-in
- Limitar a 50 mensagens/dia na fase inicial
- Não usar o número para spam

**Se acontecer:**
1. Trocar para outro número
2. Criar nova instância no Evolution
3. Atualizar o `INSTANCE_NAME` nos workflows do n8n
4. Aviso ao cliente: usar número com histórico de uso humano

### ❌ Mensagem enviada mas cliente não recebe
```bash
# Checar se a instância está conectada
GET https://api.seudominio.com.br/instance/connectionState/NOME_INSTANCIA

# Verificar logs da Evolution
docker compose logs evolution-api --tail=50

# Verificar se o número está no formato correto (55DDD9XXXXXXXX)
# Erro comum: número sem o 9 do celular ou sem o 55 do Brasil
```

---

## n8n — Workflows

### ❌ Webhook não dispara
```bash
# Verificar se o workflow está ATIVO (não pausado)
# No n8n: abrir o workflow → verificar toggle no topo

# Verificar a URL do webhook no Typebot — deve ser exatamente:
# https://n8n.seudominio.com.br/webhook/[path]
# (sem barra final, sem parâmetros extras)

# Testar o webhook manualmente
curl -X POST https://n8n.seudominio.com.br/webhook/imobiliaria-lead \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","telefone":"5513999999999"}'
```

### ❌ Google Sheets — erro de autenticação
```bash
# Verificar se a credential do Google Sheets está ativa
# n8n → Credentials → Google Sheets → testar a conexão

# Verificar se a service account tem permissão na planilha
# A planilha deve ser compartilhada com o email da service account

# Verificar se o ID da planilha está correto no workflow
# (copiar da URL: docs.google.com/spreadsheets/d/ID_AQUI/edit)
```

### ❌ OpenAI — erro 429 (rate limit)
```bash
# Verificar saldo na conta OpenAI
# Adicionar créditos se necessário

# Se o problema persistir, o fluxo de IA está sendo chamado
# com muita frequência — verificar se não há loop no Typebot
```

### ❌ Workflow executa mas dá erro no meio
```bash
# No n8n, acessar Executions (ícone de histórico)
# Clicar na execução com erro
# Ver o node que falhou e a mensagem de erro
# Clicar em "Run from here" para reexecutar do ponto de falha
```

---

## Typebot

### ❌ Flow não carrega no bot.seudominio.com.br
```bash
# Verificar se o flow está PUBLICADO (não apenas salvo)
# flows.seudominio.com.br → abrir flow → clicar "Publish"

# Verificar se o slug do flow está correto na URL
# Se o flow foi renomeado, o slug pode ter mudado

# Verificar logs do typebot-viewer
docker compose logs typebot-viewer --tail=50
```

### ❌ Variável não está sendo capturada
```bash
# No Typebot Builder, verificar se o bloco de input
# tem o campo "Save answer in a variable" preenchido
# com o nome correto da variável (ex: "nome", "telefone")
```

### ❌ Webhook não disparou no final do flow
```bash
# No Typebot, abrir o bloco Webhook e verificar:
# - URL correta do n8n
# - Body correto (variáveis entre {{duplas-chaves}})
# - Method: POST
# - Content-Type: application/json

# Testar: no modo Preview do Typebot, completar o flow
# e verificar no n8n se a execução aparece em Executions
```

---

## Chatwoot

### ❌ Conversa não aparece no Chatwoot após handoff
```bash
# Verificar se o workflow human-handoff está ativo no n8n

# Verificar as variáveis no workflow:
# CHATWOOT_ACCOUNT_ID → ID da conta no Chatwoot
# CHATWOOT_API_TOKEN → token gerado em Settings → API Access Token
# CHATWOOT_INBOX_ID → ID da inbox criada para o cliente

# Verificar logs do Chatwoot
docker compose logs chatwoot-app --tail=50
```

### ❌ Email não está funcionando no Chatwoot
```bash
# Verificar variáveis SMTP no docker-compose.yml
# Testar enviando email pelo Chatwoot: Settings → Test Email
# Gmail: usar senha de app, não a senha da conta
# Brevo (recomendado): usar SMTP do plano gratuito
```

---

## Container não sobe / reinicia em loop

```bash
# Ver o motivo do crash
docker compose logs [nome-do-servico] --tail=100

# Problemas comuns:
# 1. Variável de ambiente faltando no .env
#    Solução: comparar .env com .env.example

# 2. Porta já em uso
#    Solução: netstat -tulnp | grep PORTA
#    Parar o processo que está usando a porta

# 3. Volume corrompido (raro)
#    Solução: docker compose down -v && docker compose up -d
#    ⚠️ CUIDADO: apaga todos os dados! Só usar se não tiver dados críticos

# 4. Falta de espaço em disco
#    Solução: df -h / 
#    Limpar imagens antigas: docker system prune -af
```

---

## Problemas de SSL (HTTPS)

```bash
# Verificar se o DNS está propagado
dig api.seudominio.com.br

# Forçar renovação do certificado no NPM
# NPM → SSL Certificates → Renew (ícone de reload)

# Se não conseguir gerar: verificar se as portas 80 e 443 estão abertas
ufw status
curl -I http://seudominio.com.br  # deve responder
```

---

## Backup e recuperação

```bash
# Verificar último backup
ls -la /opt/autoatende/backups/

# Restaurar banco de dados
docker exec -i autoatende-postgres psql -U postgres < /opt/autoatende/backups/YYYYMMDD/postgres_full.sql

# Restaurar volume do n8n
tar xzf /opt/autoatende/backups/YYYYMMDD/n8n-data.tar.gz -C /opt/autoatende/volumes/
docker compose restart n8n
```

---

## Contatos de suporte dos serviços

| Serviço | Documentação | Comunidade |
|---|---|---|
| Evolution API | docs.evolution-api.com | discord.gg/evolution |
| Typebot | docs.typebot.io | discord.gg/typebot |
| n8n | docs.n8n.io | community.n8n.io |
| Chatwoot | www.chatwoot.com/docs | discord.gg/chatwoot |
