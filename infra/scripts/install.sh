#!/bin/bash
# =============================================================================
# AutoAtende — Script de Instalação Inicial do VPS
# Ubuntu 22.04 LTS
# Uso: sudo bash install.sh
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✔] $1${NC}"; }
warn()  { echo -e "${YELLOW}[!] $1${NC}"; }
error() { echo -e "${RED}[✘] $1${NC}"; exit 1; }

# ─── Verificações pré-instalação ──────────────────────────────────────────────

if [[ $EUID -ne 0 ]]; then
  error "Execute como root: sudo bash install.sh"
fi

OS=$(lsb_release -rs 2>/dev/null || echo "0")
if [[ "$OS" != "22.04" ]]; then
  warn "Testado no Ubuntu 22.04. Detectado: $OS. Continuando sob sua responsabilidade."
fi

RAM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
if [[ $RAM_KB -lt 7000000 ]]; then
  warn "RAM detectada abaixo de 8GB (${RAM_KB}kB). A stack pode não funcionar corretamente."
fi

DISK_FREE=$(df / --output=avail | tail -1)
if [[ $DISK_FREE -lt 80000000 ]]; then
  warn "Menos de 80GB livres em /. Verifique o disco antes de continuar."
fi

log "Pré-verificações concluídas."

# ─── 1. Atualização do sistema ────────────────────────────────────────────────

log "Atualizando sistema..."
apt update -y && apt upgrade -y
apt install -y \
  curl \
  git \
  ufw \
  fail2ban \
  ca-certificates \
  gnupg \
  lsb-release \
  apt-transport-https \
  software-properties-common

log "Sistema atualizado."

# ─── 2. Docker Engine (via script oficial) ────────────────────────────────────

log "Instalando Docker Engine..."
if command -v docker &>/dev/null; then
  warn "Docker já instalado ($(docker --version)). Pulando."
else
  curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
  sh /tmp/get-docker.sh
  rm /tmp/get-docker.sh
  systemctl enable docker
  systemctl start docker
  log "Docker instalado: $(docker --version)"
fi

# ─── 3. Docker Compose v2 (plugin) ───────────────────────────────────────────

log "Verificando Docker Compose v2..."
if docker compose version &>/dev/null; then
  log "Docker Compose já disponível: $(docker compose version)"
else
  COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest \
    | grep '"tag_name"' | cut -d'"' -f4)
  mkdir -p /usr/local/lib/docker/cli-plugins
  curl -SL "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-x86_64" \
    -o /usr/local/lib/docker/cli-plugins/docker-compose
  chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
  log "Docker Compose instalado: $(docker compose version)"
fi

# ─── 4. Usuário autoatende ───────────────────────────────────────────────────

log "Configurando usuário 'autoatende'..."
if id "autoatende" &>/dev/null; then
  warn "Usuário 'autoatende' já existe. Garantindo grupo docker..."
else
  useradd -m -s /bin/bash autoatende
  log "Usuário 'autoatende' criado."
fi
usermod -aG docker autoatende
log "Usuário 'autoatende' adicionado ao grupo docker."

# ─── 5. Estrutura de diretórios ───────────────────────────────────────────────

log "Criando estrutura em /opt/autoatende..."
BASE_DIR="/opt/autoatende"
mkdir -p "$BASE_DIR"/{scripts,volumes/{postgres,redis,n8n,typebot,chatwoot,evolution}}
chown -R autoatende:autoatende "$BASE_DIR"
chmod 750 "$BASE_DIR"

log "Estrutura criada:"
find "$BASE_DIR" -type d | sort | sed 's|^|    |'

# ─── 6. Firewall UFW ─────────────────────────────────────────────────────────

log "Configurando UFW..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   comment "SSH"
ufw allow 80/tcp   comment "HTTP"
ufw allow 443/tcp  comment "HTTPS"
# PORTA 81 (NPM admin) BLOQUEADA INTENCIONALMENTE
# Para configurar o Nginx Proxy Manager pela primeira vez:
#   ufw allow 81/tcp
#   (configure os proxies hosts e SSL)
#   ufw delete allow 81/tcp
ufw --force enable
log "UFW ativo:"
ufw status numbered

# ─── 7. Fail2ban ─────────────────────────────────────────────────────────────

log "Configurando fail2ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5
backend  = systemd

[sshd]
enabled  = true
port     = ssh
logpath  = %(sshd_log)s
maxretry = 3
bantime  = 86400
EOF

systemctl enable fail2ban
systemctl restart fail2ban
log "fail2ban configurado (SSH: 3 tentativas → ban de 24h)."

# ─── 8. Copiar scripts auxiliares ────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
for script in backup.sh update.sh; do
  if [[ -f "$SCRIPT_DIR/$script" ]]; then
    cp "$SCRIPT_DIR/$script" "$BASE_DIR/scripts/"
    chmod +x "$BASE_DIR/scripts/$script"
    log "$script copiado para $BASE_DIR/scripts/"
  fi
done

# ─── 9. Resumo final ─────────────────────────────────────────────────────────

VPS_IP=$(curl -s ifconfig.me || echo "N/A")

echo ""
echo -e "${GREEN}========================================="
echo "  AutoAtende — Instalação concluída! ✔"
echo -e "=========================================${NC}"
echo ""
echo "  IP do servidor: $VPS_IP"
echo ""
echo "  Próximos passos:"
echo "    1. Configure os registros DNS apontando para $VPS_IP"
echo "    2. Crie /opt/autoatende/.env (use .env.example como base)"
echo "    3. Suba a stack: cd /opt/autoatende && docker compose up -d"
echo ""
echo "  Para trabalhar como usuário autoatende:"
echo "    su - autoatende"
echo ""
warn "Porta 81 (NPM admin) está FECHADA no firewall."
warn "Abra temporariamente para configurar o Nginx Proxy Manager:"
warn "  ufw allow 81/tcp  →  configure  →  ufw delete allow 81/tcp"
echo ""
