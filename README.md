# User Management Service

**Info:** Nguyen Trong Duc — DucNT190

Fullstack mono-repo: **FastAPI** backend + **ReactJS** frontend, containerized với Docker, CI/CD qua GitLab.

---

## Kiến trúc hệ thống

```
Developer (Local)
      │
      │ git push
      ▼
GitLab Repository
      │
      │ trigger pipeline
      ▼
GitLab Runner (Digital Ocean Droplet)
      │
      ├── build → test → quality → sonarqube → scan → docker build + push
      │                                                        │
      │                                               GitLab Container Registry
      │                                                        │
      └── deploy (SSH) ──────────────────────────────────────▶│
                                                               ▼
                                                     AWS EC2 (Production)
                                                     docker pull + compose up
                                                     http://16.176.142.30:3000
```

---

## Tech Stack

| Layer         | Công nghệ                                    |
| ------------- | -------------------------------------------- |
| Backend       | Python 3.11, FastAPI, SQLAlchemy, PostgreSQL |
| Frontend      | React 18, Vite, Axios                        |
| Database      | PostgreSQL 15                                |
| Container     | Docker, Docker Compose                       |
| CI/CD         | GitLab CI/CD                                 |
| Runner        | GitLab Runner (Digital Ocean Ubuntu 22.04)   |
| Registry      | GitLab Container Registry                    |
| Production    | AWS EC2 (Ubuntu 22.04)                       |
| Code Quality  | SonarQube Community                          |
| Security Scan | Trivy                                        |

---

## CI/CD Pipeline

Pipeline tự động trigger khi có code push lên GitLab. Gồm 7 stages:

```
build → test → quality → sonarqube → scan → docker → deploy
```

| Stage         | Job                     | Mô tả                                                |
| ------------- | ----------------------- | ---------------------------------------------------- |
| **build**     | `frontend-build`        | Build React app với Vite                             |
|               | `backend-build`         | Kiểm tra FastAPI app import thành công               |
| **test**      | `frontend-test`         | Chạy Vitest unit tests                               |
|               | `backend-test`          | Chạy pytest với SQLite                               |
| **quality**   | `frontend-lint`         | ESLint kiểm tra code style                           |
|               | `backend-lint`          | Flake8 kiểm tra Python code style                    |
| **sonarqube** | `sonarqube-scan`        | Phân tích chất lượng code (bugs, smells, coverage)   |
| **scan**      | `trivy-scan-backend`    | Quét CVE vulnerabilities trong Docker image backend  |
|               | `trivy-scan-frontend`   | Quét CVE vulnerabilities trong Docker image frontend |
|               | `trivy-scan-fs`         | Quét toàn bộ filesystem                              |
| **docker**    | `docker-build-backend`  | Build + push image lên GitLab Registry               |
|               | `docker-build-frontend` | Build + push image (với production API URL)          |
| **deploy**    | `deploy-production`     | SSH vào EC2, pull image, chạy container (**manual**) |

> Stage `docker` và `deploy` chỉ chạy trên branch `main` hoặc `develop`.
> Stage `deploy-production` yêu cầu bấm tay (manual trigger).

---

## Cấu trúc project

```
.
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── crud.py          # Database operations
│   │   └── database.py      # Database connection
│   ├── tests/               # pytest tests
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── api/             # Axios API calls
│   │   └── hooks/           # Custom React hooks
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml        # Local development
├── docker-compose.prod.yml   # Production (dùng image từ Registry)
├── .gitlab-ci.yml            # CI/CD pipeline
├── sonar-project.properties  # SonarQube config
└── docs/
    └── devops-report.md
```

---

## Chạy local (Development)

### Yêu cầu

- Docker Desktop
- Git

### Các bước

```bash
# 1. Clone repo
git clone https://gitlab.com/ducnguyen2004.work/DucNT190_Docker.git
cd DucNT190_Docker

# 2. Copy file env
cp backend/.env.example backend/.env

# 3. Chạy toàn bộ stack
docker compose up --build
```

### Truy cập

| Service          | URL                        |
| ---------------- | -------------------------- |
| Frontend         | http://localhost:3000      |
| Backend API docs | http://localhost:8000/docs |
| PostgreSQL       | localhost:5432             |

---

## Chạy local (Không dùng Docker)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload    # http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
npm run lint      # kiểm tra code style
npm run test      # chạy unit test
```

---

## GitLab CI/CD Variables

Các biến cần cấu hình tại `GitLab → Settings → CI/CD → Variables`:

| Variable             | Mô tả                    |
| -------------------- | ------------------------ |
| `PRODUCTION_HOST`    | IP của EC2 production    |
| `PRODUCTION_SSH_KEY` | Private key SSH vào EC2  |
| `SONAR_TOKEN`        | Token xác thực SonarQube |
| `SONAR_HOST_URL`     | URL SonarQube server     |

---

## Production

App đang chạy tại:

| Service          | URL                            |
| ---------------- | ------------------------------ |
| Frontend         | http://16.176.142.30:3000      |
| Backend API docs | http://16.176.142.30:8000/docs |
