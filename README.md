# CampusKart

CampusKart is a campus-focused ecommerce marketplace for college students. The application is organized as a production-oriented monorepo with a Spring Boot API, React frontend, MySQL database, Docker Compose environment, and CI workflow.

## Implemented Phases

### Phase 1: Foundation

- `backend/` - Spring Boot 3 API with common response/error handling and health endpoint.
- `frontend/` - React app scaffold using Vite, Tailwind CSS, React Router, Redux Toolkit, and Axios.
- `docker-compose.yml` - Local MySQL, backend, and frontend orchestration.
- `.github/workflows/ci.yml` - Backend and frontend build workflow.

### Phase 2: Authentication and RBAC

- College email registration with configurable allowed domains.
- Email verification token flow. In development, the raw token is returned in the registration response for local testing.
- Stateless JWT access tokens and persisted, hashed refresh tokens.
- Login, logout, and refresh-token rotation.
- Role model with `STUDENT`, `SELLER`, and `ADMIN`; admin accounts cannot self-register.
- Frontend auth pages, protected dashboard route, persisted auth state, and Axios token refresh interceptor.

Marketplace modules such as products, cart, orders, payments, and addresses are intentionally deferred to later phases.

## Local Development

```bash
docker compose up --build
```

Backend health: `http://localhost:8080/api/v1/health`

The frontend folder is present but not scaffolded in this checkout yet, so Docker Compose currently starts the backend service only.

## Phase 2 Auth Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/verify-email`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`

## Architecture Baseline

The backend follows a layered structure:

- `controller` packages expose REST APIs.
- `service` packages own business workflows.
- `repository` packages own persistence.
- `domain` packages own entities and value concepts.
- `dto` packages own request/response payloads.
- `common` contains API envelopes, error handling, and shared exceptions.
- `config` contains cross-cutting application configuration.

The frontend keeps global app wiring under `src/app`, API clients under `src/lib`, pages under `src/pages`, and shared styles under `src/styles`.
