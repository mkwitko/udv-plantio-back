#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$PROJECT_DIR"

echo "=========================================="
echo " UDV Plantio Production Deploy"
echo "=========================================="

echo "==> Pulling latest code..."
# 

git pull origin main

echo "==> Building backend..."

docker compose build --parallel backend

echo "==> Restarting container..."

docker compose up -d --force-recreate backend

echo "==> Syncing Prisma schema (db push, no migrations dir)..."

docker compose exec -T backend npx prisma db push --skip-generate

echo "==> Waiting for health check..."

for i in {1..15}; do
  if curl -sf http://localhost:3333/health > /dev/null 2>&1; then
    echo ""
    echo "=========================================="
    echo " Deploy successful!"
    echo "=========================================="
    exit 0
  fi

  echo "Waiting backend... ($i/15)"

  sleep 2
done

echo ""
echo "=========================================="
echo " Error: backend did not become healthy" >&2
echo "=========================================="

docker compose logs --tail=100 backend

exit 1
