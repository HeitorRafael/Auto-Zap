#!/bin/bash
# AutoAtende — Backup automático diário
# Adicionar ao crontab: 0 3 * * * /opt/autoatende/scripts/backup.sh >> /var/log/autoatende-backup.log 2>&1

set -euo pipefail

BASE_DIR="/opt/autoatende"
BACKUP_DIR="$BASE_DIR/backups/$(date +%Y%m%d_%H%M)"
mkdir -p "$BACKUP_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Iniciando backup..."

# Dump completo do PostgreSQL
docker exec autoatende-postgres pg_dumpall -U postgres > "$BACKUP_DIR/postgres_full.sql"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] PostgreSQL: OK"

# Backup dos volumes do n8n e Typebot (dados mais críticos)
tar czf "$BACKUP_DIR/n8n-data.tar.gz"      -C "$BASE_DIR/volumes" n8n/
tar czf "$BACKUP_DIR/typebot-data.tar.gz"  -C "$BASE_DIR/volumes" typebot/
tar czf "$BACKUP_DIR/evolution-data.tar.gz" -C "$BASE_DIR/volumes" evolution/
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Volumes: OK"

# Manter apenas últimos 7 backups
find "$BASE_DIR/backups" -maxdepth 1 -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup concluído em: $BACKUP_DIR"
