# DevOps Report - User Management Service

## Assignment 01: Docker & Containerization

### Docker Architecture Decisions

#### Backend Dockerfile
- Base image: `python:3.11-slim` — slim variant reduces image size significantly vs full python image
- `requirements.txt` is copied and installed before source code to leverage Docker layer caching; dependencies change less frequently than source
- `uvicorn` runs with `--host 0.0.0.0` so it binds to all interfaces inside the container

#### Frontend Dockerfile (Multi-stage)
- **Stage 1 (builder):** `node:20-alpine` builds the React app with Vite. Alpine keeps the build context small.
- **Stage 2 (production):** `nginx:alpine` serves only the compiled static files — the final image contains no Node.js runtime, drastically reducing image size and attack surface.
- Custom `nginx.conf` uses `try_files $uri $uri/ /index.html` to support React Router (client-side routing fallback).

#### Docker Compose Design
- **Named volume** `postgres_data` persists database state across container restarts.
- **Custom bridge network** `user_management_network` isolates services and enables DNS resolution between containers (backend connects to `db:5432`).
- **Healthcheck** on the PostgreSQL service ensures the backend only starts after the database is truly ready (not just container started).
- `depends_on` with `condition: service_healthy` enforces startup order.

### Backend/Frontend Connection
- The backend exposes port 8000; CORS middleware allows all origins for development.
- The frontend (nginx) serves on port 80 (mapped to 3000 on the host).
- `VITE_API_BASE_URL` environment variable controls the backend URL without hardcoding.

---

## Assignment 02: CI/CD Pipeline

### Pipeline Design Rationale

The pipeline has 4 stages: `lint → build → docker → deploy`.

| Stage | Purpose |
|-------|---------|
| `lint` | Fast feedback — catch syntax and style issues before heavy builds |
| `build` | Compile frontend, run unit tests, upload artifacts |
| `docker` | Build and push versioned images to registry |
| `deploy` | Deploy to staging (auto on `develop`), production (manual on `main`) |

### Frontend Build Flow
1. `npm ci` — deterministic install from lock file
2. `npm run lint` — ESLint with zero-warnings policy (pipeline fails on lint errors)
3. `npm run build` — Vite compiles React app to `dist/`
4. `npm run test:run` — Vitest runs component tests
5. Artifact `dist/` uploaded with 1-week retention

### Docker Image Build & Push Flow
1. Docker-in-Docker (`docker:24-dind`) service provides the Docker daemon
2. Login to GitLab Container Registry using CI-injected `$CI_REGISTRY_*` variables (no hardcoded secrets)
3. Images tagged with both `$CI_COMMIT_SHA` (immutable, traceable) and `latest` (convenience)
4. Only runs on `main` or `develop` branches — prevents image pollution from feature branches

### Security
- All credentials use GitLab CI/CD variables (`$CI_REGISTRY_USER`, `$CI_REGISTRY_PASSWORD`)
- No secrets in `.gitlab-ci.yml` or source code
- npm cache and pip cache keyed by branch to avoid cross-branch pollution

---

## Assignment 03: ReactJS Frontend

### Component Structure

```
src/
  api/
    userApi.js         — Axios client, all API calls in one place
  hooks/
    useUsers.js        — Custom hook managing fetch state (loading/error/data)
  components/
    UserForm.jsx       — Controlled form for create/edit with validation
    UserList.jsx       — Wrapper handling loading/error states
    UserTable.jsx      — Pure presentational table
  pages/
    UsersPage.jsx      — Orchestrator: owns mutation logic and notifications
  App.jsx              — Root layout only
```

### API Integration Flow

```
UsersPage
  └── userApi.create/update/delete(data)
        └── axios → VITE_API_BASE_URL/users[/{id}]
              └── FastAPI backend → PostgreSQL

useUsers hook
  └── userApi.getAll()
        └── axios → GET /users
              └── Returns User[]
```

- `VITE_API_BASE_URL` is set at build time via `.env` — no hardcoded URLs in components
- `userApi.js` is the single source of truth for all HTTP calls
- Errors are caught at the page level and shown as dismissing alerts
- List is refreshed via `refetch()` after any mutation to keep UI consistent with DB state
