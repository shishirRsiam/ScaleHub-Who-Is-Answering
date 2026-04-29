#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}ScaleHub - Docker Setup${NC}"
echo -e "${YELLOW}================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo ""
echo -e "${YELLOW}Building and starting containers...${NC}"
docker-compose up -d --build

echo ""
echo -e "${GREEN}✓ Containers are starting...${NC}"
echo ""

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Check if backend is ready
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose exec -T backend python manage.py migrate

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${GREEN}Access the application:${NC}"
echo -e "  Frontend:  ${YELLOW}http://localhost:3000${NC}"
echo -e "  Backend:   ${YELLOW}http://localhost:8000/api/v1${NC}"
echo -e "  Database:  ${YELLOW}localhost:5432${NC}"
echo ""
echo -e "${YELLOW}Quick Commands:${NC}"
echo -e "  View logs:      docker-compose logs -f"
echo -e "  Stop services:  docker-compose down"
echo -e "  Scale backend:  docker-compose up -d --scale backend=5"
echo ""
