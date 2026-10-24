#!/usr/bin/env bash
# Starts local PostgreSQL daemon for EthioEqub on unix socket /tmp (port 5436)

PG_DIR="/tmp/ethioequb_pgdata"
PG_LOG="/tmp/ethioequb_pg.log"

if [ ! -d "$PG_DIR" ]; then
    echo "Initializing database cluster at $PG_DIR..."
    /usr/lib/postgresql/17/bin/initdb -D "$PG_DIR" --auth=trust --no-instructions
fi

if pg_isready -h /tmp -p 5436 >/dev/null 2>&1; then
    echo "PostgreSQL is already running on /tmp:5436"
else
    echo "Starting PostgreSQL daemon..."
    /usr/lib/postgresql/17/bin/pg_ctl -D "$PG_DIR" -l "$PG_LOG" -o "-k /tmp -p 5436 -h ''" start
fi

pg_isready -h /tmp -p 5436
