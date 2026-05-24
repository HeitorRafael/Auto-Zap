#!/bin/bash
# =============================================================================
# AutoAtende — Primeiro Deploy no VPS
# Uso: bash deploy-vps.sh /caminho/para/o/repo
# Pré-requisito: install.sh já rodou, .env já está preenchido
# =============================================================================

set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()   { echo -e "${GREEN}[✔] $1${NC}"; }
warn()  { echo -e "${YELLOW}[!] $1${NC}"; }
error() { echo -e "${RED}[✘] $1${NC}"; exit 1; }

REPO_PATH=${1:-"$(pwd)"}
DEPLOY_DIR="/opt/autoatende"

[[ $EUID -ne 0 ]] && error "Execute como root: sudo bash deploy-vps.sh"
[[ ! -f "$REPO_PATH/infra/docker-compose.yml" ]] && error "Repositório não encontrado em: $REPO_PATH"
[[ ! -f "$DEPLOY_DIR/.env" ]] && error ".env não encontrado em $DEPLOY_DIR — preencha antes de continuar"

# ─── Copiar arquivos ────────────────────────────────────────────────────────
log "Copiando arquivos para $DEPLOY_DIR..."
cp "$REPO_PATH/infra/docker-compose.yml"        "$DEPLOY_DIR/"
cp "$REPO_PATH/infra/scripts/init-db.sh"        "$DEPLOY_DIR/scripts/"
cp "$REPO_PATH/infra/scripts/backup.sh"         "$DEPLOY_DIR/scripts/"
cp "$REPO_PATH/infra/scripts/update.sh"         "$DEPLOY_DIR/scripts/"
chmod +x "$DEPLOY_DIR/scripts/"*.sh
chown -R autoatende:autoatende "$DEPLOY_DIR"
log "Arquivos copiados."

# ─── Subir infraestrutura base ──────────────────────────────────────────────
cd "$DEPLOY_DIR"

log "Subindo postgres e redis..."
docker compose up -d postgres redis

log "Aguardando bancos ficarem saudáveis (30s)..."
sleep 30

# Verificar saúde dos bancos
for service in postgres redis; do
  STATUS=$(docker compose ps --format json | python3 -c "
import sys, json
for line in sys.stdin:
    s = json.loads(line)
    if s.get('Service') == '$service':
        print(s.get('Health', s.get('State', 'unknown')))
" 2>/dev/null || echo "unknown")
  if [[ "$STATUS" == "healthy" ]]; then
    log "$service: healthy ✅"
  else
    warn "$service: status=$STATUS — verificar manualmente se necessário"
  fi
done

# ─── Subir o resto ──────────────────────────────────────────────────────────
log "Subindo todos os serviços..."
docker compose up -d

log "Aguardando inicialização (60s)..."
sleep 60

# ─── Status ─────────────────────────────────────────────────────────────────
echo ""
log "Status dos containers:"
docker compose ps
echo ""

# ─── Configurar crontab de backup ───────────────────────────────────────────
CRON_JOB="0 3 * * * /opt/autoatende/scripts/backup.sh >> /var/log/autoatende-backup.log 2>&1"
if crontab -l 2>/dev/null | grep -q "autoatende/scripts/backup.sh"; then
  warn "Crontab de backup já existe. Pulando."
else
  (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
  log "Crontab de backup configurado (diário às 3h)."
fi

# ─── Resumo ─────────────────────────────────────────────────────────────────
VPS_IP=$(curl -s ifconfig.me 2>/dev/null || echo "N/A")
DOMAIN=$(grep "^DOMAIN=" "$DEPLOY_DIR/.env" | cut -d= -f2)

echo ""
echo -e "${GREEN}============================================="
echo "  AutoAtende — Deploy concluído! ✅"
echo -e "=============================================${NC}"
echo ""
echo "  Próximos passos manuais:"
echo ""
echo "  1. Abrir temporariamente porta 81:"
echo "     ufw allow 81/tcp"
echo "     Configurar NPM em: http://$VPS_IP:81"
echo "     FECHAR após: ufw delete allow 81/tcp"
echo ""
echo "  2. Configurar DNS:"
echo "     api.$DOMAIN      → $VPS_IP"
echo "     flows.$DOMAIN    → $VPS_IP"
echo "     bot.$DOMAIN      → $VPS_IP"
echo "     n8n.$DOMAIN      → $VPS_IP"
echo "     atende.$DOMAIN   → $VPS_IP"
echo ""
echo "  3. Deploy do frontend na Vercel:"
echo "     cd frontend && npx vercel --prod"
echo ""
echo "  4. Ver checklist completo:"
echo "     docs/deploy-checklist.md"
echo ""
