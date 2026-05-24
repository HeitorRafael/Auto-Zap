#!/bin/bash
# Cria os databases necessários para cada serviço dentro do PostgreSQL
# Executado automaticamente na primeira inicialização do container postgres

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  SELECT 'CREATE DATABASE typebot'  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'typebot')\gexec
  SELECT 'CREATE DATABASE chatwoot' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'chatwoot')\gexec
  SELECT 'CREATE DATABASE n8n'      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'n8n')\gexec
  SELECT 'CREATE DATABASE evolution' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'evolution')\gexec
EOSQL

echo "Databases criados: typebot, chatwoot, n8n, evolution"
