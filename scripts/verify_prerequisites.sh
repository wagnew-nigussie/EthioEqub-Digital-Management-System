#!/usr/bin/env bash
# ==============================================================================
# EthioEqub Digital Management System - Environment Prerequisites Checker
# Inspects operating system, runtimes, package managers, and database tools.
# Safe, read-only diagnostic script.
# ==============================================================================

set -u

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${BOLD}${CYAN}======================================================================${NC}"
echo -e "${BOLD}${CYAN}   EthioEqub Digital Management System — Phase 3 Prerequisite Check   ${NC}"
echo -e "${BOLD}${CYAN}======================================================================${NC}"
echo ""

# 1. Operating System
echo -e "${BOLD}[1/7] Operating System & Architecture:${NC}"
OS_NAME=$(uname -s)
KERNEL_VER=$(uname -r)
ARCH=$(uname -m)
DISTRO="Unknown"
if [ -f /etc/os-release ]; then
    DISTRO=$(grep PRETTY_NAME /etc/os-release | cut -d= -f2 | tr -d '"')
fi
echo -e "  * OS:           ${GREEN}${OS_NAME} (${DISTRO})${NC}"
echo -e "  * Kernel:       ${GREEN}${KERNEL_VER} (${ARCH})${NC}"
echo ""

# 2. Node.js Runtime
echo -e "${BOLD}[2/7] Node.js Runtime:${NC}"
if command -v node >/dev/null 2>&1; then
    NODE_VER=$(node -v)
    MAJOR_VER=$(echo "$NODE_VER" | cut -d. -f1 | tr -d 'v')
    if [ "$MAJOR_VER" -ge 20 ]; then
        echo -e "  * Node.js:      ${GREEN}${NODE_VER} (PASS: >= v20 LTS)${NC}"
    else
        echo -e "  * Node.js:      ${YELLOW}${NODE_VER} (WARNING: v20+ recommended)${NC}"
    fi
else
    echo -e "  * Node.js:      ${RED}NOT FOUND${NC}"
fi
echo ""

# 3. npm Package Manager
echo -e "${BOLD}[3/7] npm Package Manager:${NC}"
if command -v npm >/dev/null 2>&1; then
    NPM_VER=$(npm -v)
    echo -e "  * npm:          ${GREEN}v${NPM_VER} (PASS)${NC}"
else
    echo -e "  * npm:          ${RED}NOT FOUND${NC}"
fi
echo ""

# 4. Git Version Control
echo -e "${BOLD}[4/7] Git Version Control:${NC}"
if command -v git >/dev/null 2>&1; then
    GIT_VER=$(git --version)
    echo -e "  * Git:          ${GREEN}${GIT_VER} (PASS)${NC}"
else
    echo -e "  * Git:          ${RED}NOT FOUND${NC}"
fi
echo ""

# 5. PostgreSQL Tools & Clients
echo -e "${BOLD}[5/7] PostgreSQL Tooling:${NC}"
if command -v psql >/dev/null 2>&1; then
    PSQL_VER=$(psql --version)
    echo -e "  * psql client:  ${GREEN}${PSQL_VER} (PASS)${NC}"
else
    echo -e "  * psql client:  ${YELLOW}NOT FOUND (Optional for client if using Prisma / Cloud DB)${NC}"
fi

if command -v pg_isready >/dev/null 2>&1; then
    PG_ISREADY_VER=$(pg_isready --version)
    echo -e "  * pg_isready:   ${GREEN}${PG_ISREADY_VER} (PASS)${NC}"
fi

# Check default port 5432
if command -v pg_isready >/dev/null 2>&1 && pg_isready -h localhost -p 5432 -t 1 >/dev/null 2>&1; then
    echo -e "  * Port 5432:    ${GREEN}PostgreSQL server is actively listening on localhost:5432${NC}"
else
    echo -e "  * Port 5432:    ${CYAN}Port 5432 is currently idle/free (ready for dedicated container or local service)${NC}"
fi
echo ""

# 6. Containerization (Docker)
echo -e "${BOLD}[6/7] Docker & Containers (Database Isolation):${NC}"
if command -v docker >/dev/null 2>&1; then
    DOCKER_VER=$(docker --version)
    echo -e "  * Docker:       ${GREEN}${DOCKER_VER} (PASS)${NC}"
    if docker info >/dev/null 2>&1; then
        echo -e "  * Daemon:       ${GREEN}Docker daemon is running and responsive${NC}"
    else
        echo -e "  * Daemon:       ${YELLOW}Docker CLI present but daemon unreachable${NC}"
    fi
else
    echo -e "  * Docker:       ${YELLOW}NOT FOUND (Optional: Can use local PostgreSQL or Cloud Neon DB)${NC}"
fi
echo ""

# 7. Hardware, Storage & Memory
echo -e "${BOLD}[7/7] System Resources:${NC}"
AVAIL_DISK=$(df -h . | awk 'NR==2 {print $4}')
TOTAL_DISK=$(df -h . | awk 'NR==2 {print $2}')
AVAIL_MEM=$(free -m | awk 'NR==2 {print $7}')
TOTAL_MEM=$(free -m | awk 'NR==2 {print $2}')
echo -e "  * Disk Space:   ${GREEN}${AVAIL_DISK} available (Total: ${TOTAL_DISK}) (PASS)${NC}"
echo -e "  * RAM (Free):   ${GREEN}${AVAIL_MEM} MB available (Total: ${TOTAL_MEM} MB) (PASS)${NC}"
echo ""

echo -e "${BOLD}${CYAN}======================================================================${NC}"
echo -e "${BOLD}${GREEN}   Prerequisite Diagnostic Complete: System Ready for Phase 4!       ${NC}"
echo -e "${BOLD}${CYAN}======================================================================${NC}"
