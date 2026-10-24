#!/usr/bin/env bash
# EthioEqub Full-Stack Local Launcher
# Ensures PostgreSQL is active, then starts both Backend API and Frontend Client

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=== 1. Checking PostgreSQL Daemon ==="
./scripts/start_postgres.sh

echo ""
echo "=== 2. Starting EthioEqub Backend & Frontend ==="
echo "Backend API:  http://localhost:5000"
echo "Frontend App: http://localhost:5173"
echo ""

# Run backend and frontend
npm run dev:server &
SERVER_PID=$!

npm run dev:client &
CLIENT_PID=$!

trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null || true" EXIT

wait
