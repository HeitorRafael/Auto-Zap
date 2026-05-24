#!/bin/bash
# AutoAtende — Atualização dos containers
# Uso: bash update.sh [nome-do-servico]
# Sem argumento: atualiza todos

set -euo pipefail

BASE_DIR="/opt/autoatende"
cd "$BASE_DIR"

SERVICE=${1:-""}

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Puxando imagens mais recentes..."
if [[ -n "$SERVICE" ]]; then
  docker compose pull "$SERVICE"
  docker compose up -d --no-deps "$SERVICE"
else
  docker compose pull
  docker compose up -d
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Limpando imagens antigas..."
docker image prune -f

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Status atual:"
docker compose ps
