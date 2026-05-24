# 🚀 Deploy Checklist — AutoAtende

> Execute nessa ordem. Não pule etapas.

---

## ETAPA 1 — Pré-requisitos

```bash
# Checklist do VPS antes de tudo
uname -a                    # deve ser Ubuntu 22.04
free -h                     # mínimo 8GB RAM
df -h /                     # mínimo 80GB livres
curl -V                     # curl disponível
```

**Contrate antes de continuar:**
- [ ] VPS: Hostinger KVM 2 ou Contabo S (4vCPU, 8GB, 100GB SSD)
- [ ] Domínio: Registro.br (~R$40/ano) ou Namecheap
- [ ] Conta Vercel (gratuita)
- [ ] Conta Google (para Sheets + Drive)
- [ ] Chave OpenAI com créditos (GPT-4o-mini)

---

## ETAPA 2 — VPS: instalação base

```bash
# 1. Acesse o VPS como root
ssh root@SEU_IP_VPS

# 2. Faça upload do install.sh (ou copie o conteúdo)
# Em Windows: use o WinSCP ou o comando abaixo
scp infra/scripts/install.sh root@SEU_IP_VPS:/tmp/

# 3. Execute
chmod +x /tmp/install.sh
bash /tmp/install.sh

# 4. Verifique
docker --version              # deve aparecer a versão
docker compose version        # deve aparecer v2.x
ufw status                    # 22, 80, 443 liberados
systemctl status fail2ban     # active (running)
ls /opt/autoatende/volumes/   # 6 pastas criadas
```

---

## ETAPA 3 — Configurar variáveis de ambiente

```bash
# No VPS, como root ou autoatende
cd /opt/autoatende

# Copiar o arquivo .env.example do repositório
cp infra/.env.example .env

# Editar e preencher TODOS os campos
nano .env

# Dica: gerar senhas fortes de uma vez
echo "POSTGRES_PASSWORD=$(openssl rand -base64 32)"
echo "REDIS_PASSWORD=$(openssl rand -base64 24)"
echo "EVOLUTION_API_KEY=$(openssl rand -hex 32)"
echo "TYPEBOT_ENCRYPTION_SECRET=$(openssl rand -base64 32)"
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
echo "N8N_ENCRYPTION_KEY=$(openssl rand -base64 32)"
echo "CHATWOOT_SECRET_KEY_BASE=$(openssl rand -hex 64)"
```

> ⚠️ Preencha também `DOMAIN=seudominio.com.br` no `.env`

---

## ETAPA 4 — DNS (no painel do seu registrador)

Configure registros tipo **A** apontando para o IP do VPS:

| Subdomínio                     | Tipo | Destino        |
|-------------------------------|------|----------------|
| `api.seudominio.com.br`       | A    | IP_DO_VPS      |
| `flows.seudominio.com.br`     | A    | IP_DO_VPS      |
| `bot.seudominio.com.br`       | A    | IP_DO_VPS      |
| `n8n.seudominio.com.br`       | A    | IP_DO_VPS      |
| `atende.seudominio.com.br`    | A    | IP_DO_VPS      |
| `seudominio.com.br` (raiz)    | CNAME| cname.vercel-dns.com |

> Propagação pode levar até 24h. Verifique com: `dig api.seudominio.com.br`

---

## ETAPA 5 — Subir a stack Docker

```bash
cd /opt/autoatende

# Copiar os arquivos do projeto
cp /caminho/do/repo/infra/docker-compose.yml .
cp /caminho/do/repo/infra/scripts/init-db.sh ./scripts/

# Subir infraestrutura base primeiro
docker compose up -d postgres redis
echo "Aguardando bancos ficarem saudáveis..."
sleep 30

# Verificar saúde
docker compose ps

# Subir o resto
docker compose up -d

# Acompanhar logs
docker compose logs -f --tail=50
```

---

## ETAPA 6 — Nginx Proxy Manager

```bash
# 1. Librar a porta 81 TEMPORARIAMENTE
ufw allow 81/tcp

# 2. Acesse no navegador: http://SEU_IP_VPS:81
# Login padrão: admin@example.com / changeme
# TROQUE A SENHA IMEDIATAMENTE após o primeiro login

# 3. Adicionar Proxy Hosts (um por subdomínio):
```

| Domain Name                    | Forward Hostname | Port | SSL             |
|-------------------------------|------------------|------|-----------------|
| `api.seudominio.com.br`       | evolution-api    | 8080 | Let's Encrypt ✅|
| `flows.seudominio.com.br`     | typebot-builder  | 3000 | Let's Encrypt ✅|
| `bot.seudominio.com.br`       | typebot-viewer   | 3001 | Let's Encrypt ✅|
| `n8n.seudominio.com.br`       | n8n              | 5678 | Let's Encrypt ✅|
| `atende.seudominio.com.br`    | chatwoot-app     | 3000 | Let's Encrypt ✅|

```bash
# 4. Para n8n e Evolution API: adicionar Access List (HTTP Basic Auth)
# NPM → Access Lists → Add → Username + Password forte

# 5. FECHAR a porta 81 após configurar
ufw delete allow 81/tcp
ufw status  # confirmar que 81 não aparece mais
```

---

## ETAPA 7 — Configurar serviços

### Typebot
```
1. Acesse https://flows.seudominio.com.br
2. Crie sua conta (use o ADMIN_EMAIL do .env)
3. Importe os flows da pasta /flows/*.json
4. Publique cada flow e anote os IDs públicos
5. Atualize as vars NEXT_PUBLIC_TYPEBOT_*_ID na Vercel
```

### n8n
```
1. Acesse https://n8n.seudominio.com.br (com Basic Auth)
2. Importe os workflows de /n8n-workflows/*.json
3. Configure as credentials:
   - Google Sheets OAuth2
   - OpenAI API Key
4. Ative todos os workflows
```

### Evolution API
```
1. Acesse https://api.seudominio.com.br/manager
   (ou use a API diretamente com sua EVOLUTION_API_KEY)
2. Crie uma instância com o nome do cliente
3. Escaneie o QR Code com o WhatsApp Business do cliente
4. Teste: envie uma mensagem e veja no Chatwoot
```

### Chatwoot
```
1. Acesse https://atende.seudominio.com.br
2. Crie a conta de superadmin
3. Crie um account para cada cliente
4. Crie uma inbox do tipo "API" para cada cliente
5. Anote o inbox_id (usar nos workflows n8n)
```

---

## ETAPA 8 — Frontend na Vercel

```bash
# Na sua máquina local
cd frontend
npm install

# Deploy
npx vercel --prod

# No dashboard da Vercel, adicionar variáveis de ambiente:
# NEXT_PUBLIC_TYPEBOT_IMOBILIARIA_ID = (ID do flow publicado)
# NEXT_PUBLIC_TYPEBOT_RESTAURANTE_ID = (ID do flow publicado)
# NEXT_PUBLIC_TYPEBOT_ESTETICA_ID    = (ID do flow publicado)
# NEXT_PUBLIC_TYPEBOT_VIEWER_URL     = https://bot.seudominio.com.br
# NEXT_PUBLIC_WHATSAPP_CONTATO       = 5513XXXXXXXXX
# N8N_WEBHOOK_URL                    = https://n8n.seudominio.com.br/webhook/contato
# NEXTAUTH_SECRET                    = (mesmo valor do .env do VPS)
# ADMIN_PASSWORD_HASH                = (bcrypt hash da senha do cliente)
# GOOGLE_SHEETS_ID                   = (ID da planilha do cliente)
# GOOGLE_SHEETS_API_KEY              = (chave da API)

# Configurar domínio customizado na Vercel:
# Settings → Domains → Add → autoatende.com.br
```

---

## ETAPA 9 — Configurar backup automático

```bash
# No VPS
cp /caminho/repo/infra/scripts/backup.sh /opt/autoatende/scripts/
chmod +x /opt/autoatende/scripts/backup.sh

# Adicionar ao crontab
crontab -e
# Adicionar a linha:
# 0 3 * * * /opt/autoatende/scripts/backup.sh >> /var/log/autoatende-backup.log 2>&1

# Testar manualmente
bash /opt/autoatende/scripts/backup.sh

# Verificar arquivo gerado
ls /opt/autoatende/backups/
```

---

## ETAPA 10 — Monitoramento (UptimeRobot — gratuito)

```
1. Crie conta em uptimerobot.com
2. Adicione monitores HTTP(S) para:
   - https://api.seudominio.com.br/health
   - https://flows.seudominio.com.br
   - https://atende.seudominio.com.br
   - https://seudominio.com.br (landing)
3. Configure alertas por WhatsApp ou email
4. Intervalo: 5 minutos
```

---

## ✅ Checklist de Segurança Final

- [ ] Porta 81 (NPM admin) fechada no UFW
- [ ] n8n com Basic Auth ativo
- [ ] Evolution API com `AUTHENTICATION_API_KEY` forte
- [ ] Todos os containers sem `privileged: true`
- [ ] Apenas portas 22, 80, 443 abertas no UFW
- [ ] `.env` NÃO está no repositório git
- [ ] Backup testado e arquivo gerado confirmado
- [ ] SSL válido em todos os subdomínios (testar no SSL Labs)
- [ ] `fail2ban` ativo (`systemctl status fail2ban`)
- [ ] Senhas admin geradas individualmente por cliente
- [ ] Primeira mensagem do bot inclui aviso de privacidade

---

## Verificação final

```bash
# Todos os serviços healthy?
docker compose ps

# Testar endpoints
curl https://api.seudominio.com.br/health
curl -I https://flows.seudominio.com.br
curl -I https://atende.seudominio.com.br

# Landing page no ar?
curl -I https://seudominio.com.br

echo "✅ Deploy concluído!"
```
