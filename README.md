# User Management Service

Fullstack mono-repo: FastAPI backend + ReactJS frontend, containerized with Docker.

## Quick Start

```bash
# Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Run entire stack
docker compose up --build

# Access:
# Frontend → http://localhost:3000
# Backend API docs → http://localhost:8000/docs
# PostgreSQL → localhost:5432
```

## Project Structure

```
.
├── backend/          FastAPI + SQLAlchemy + PostgreSQL
├── frontend/         React 18 + Vite + Axios
├── docker-compose.yml
├── .gitlab-ci.yml
└── docs/devops-report.md
```

## Development

### Backend (local)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (local)
```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
npm run lint
npm run test
```
