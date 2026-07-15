# CampusKart

CampusKart is a full-stack campus-focused ecommerce marketplace for college students. It works like a campus-restricted OLX-style platform where students can buy and sell second-hand books, notes, electronics, lab equipment, cycles, hostel items, furniture, and study resources within their university ecosystem.

The project is built as a production-style monorepo with a Spring Boot backend, React frontend, MySQL database, JWT-based authentication, Docker Compose, and GitHub Actions CI.

## Current Status

Completed:

- User authentication with register, login, logout, refresh token, and email verification token flow.
- JWT-based stateless security using Spring Security.
- Role model with `STUDENT`, `SELLER`, and `ADMIN`.
- Seller product listing CRUD.
- Product image upload through local storage abstraction.
- Public product catalog and product detail pages.
- Cart flow: add item, update quantity, remove item, view cart.
- Address management: add, edit, delete, set default address.
- Order flow: place order from cart, view history, view detail, cancel pending order.
- Mock payment flow: initiate payment, check status, confirm payment.
- React frontend for auth, dashboard, products, seller listing pages, cart, checkout, orders, payments, and addresses.
- Modern frontend UI polish with responsive marketplace layout, hero carousel, product cards, skeleton loading states, and empty states.
- Docker Compose for MySQL, backend, and frontend.
- GitHub Actions CI for backend tests and frontend build.

Pending / Phase 8:

- Real automated backend test coverage for services, controllers, repositories, and security.
- Frontend component/route tests.
- JaCoCo coverage reporting.
- Frontend lint step in CI.
- Production deployment pipeline.
- Production-grade secret management.
- Optional real Razorpay adapter behind the existing payment gateway interface.

## Tech Stack

Frontend:

- React with functional components and hooks
- Vite
- Tailwind CSS
- React Router
- Redux Toolkit
- Axios with interceptors
- Lucide React icons

Backend:

- Spring Boot 3.x
- Spring Security 6.x
- JWT authentication
- Spring Data JPA / Hibernate
- Bean Validation
- Flyway migrations
- Maven

Database:

- MySQL 8.x

DevOps:

- Docker
- Docker Compose
- GitHub Actions

## Repository Structure

```text
CampusKart/
  backend/
    src/main/java/com/campuskart/api/
      auth/
      product/
      cart/
      address/
      order/
      payment/
      storage/
      common/
      config/
      health/
    src/main/resources/
      db/migration/
      application.properties
      application-dev.properties
      application-prod.properties
    pom.xml
    Dockerfile

  frontend/
    src/
      app/
      components/
      features/
      lib/
      pages/
      styles/
    public/
    package.json
    Dockerfile

  docker-compose.yml
  .github/workflows/ci.yml
  README.md
```

## Architecture Overview

Backend follows a layered structure:

```text
Controller -> Service -> Repository -> Entity
```

Responsibilities:

- Controllers expose versioned REST APIs under `/api/v1`.
- Services hold business rules and transaction boundaries.
- Repositories handle persistence using Spring Data JPA.
- DTOs separate API payloads from database entities.
- Flyway manages schema migrations.
- Security is stateless and JWT-based.
- Payment integration is abstracted through a `PaymentGateway` interface.
- Image storage is abstracted through a storage service.

Frontend follows a feature-oriented structure:

```text
app/        router, layout, Redux store
features/   API helpers and feature state
pages/      route-level screens
components/ reusable UI components
lib/        shared utilities like Axios client
```

## Security Summary

Authentication:

- Access token and refresh token flow.
- Stateless JWT authentication.
- Passwords are hashed before storage.
- Refresh tokens are stored and revocable.
- College email verification token flow exists.

Authorization:

- Public endpoints include register, login, email verification, refresh token, health check, public product browsing, and product image serving.
- Authenticated endpoints include cart, addresses, orders, payments, and seller product ownership flows.
- Explicit role-secured endpoints currently exist for seller product management.

Explicit role-secured endpoints:

```text
GET    /api/v1/products/me
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
POST   /api/v1/products/{id}/images
```

Current explicit role count:

```text
SELLER: 5 endpoints
STUDENT: 0 explicit role-only endpoints
ADMIN: 0 explicit role-only endpoints
```

Many other endpoints are authenticated and ownership-protected, but not tied to one explicit role.

## Database Schema

Flyway migrations:

```text
V1__create_auth_tables.sql
V2__create_product_tables.sql
V3__create_cart_tables.sql
V4__create_address_table.sql
V5__create_order_tables.sql
V6__create_payment_table.sql
```

Main tables:

```text
users
refresh_tokens
email_verification_tokens
products
product_images
carts
cart_items
addresses
orders
order_items
payments
flyway_schema_history
```

## Core API Surface

Auth:

```text
POST /api/v1/auth/register
POST /api/v1/auth/verify-email
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
```

Products:

```text
GET    /api/v1/products
GET    /api/v1/products/{id}
GET    /api/v1/products/me
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
POST   /api/v1/products/{id}/images
```

Cart:

```text
GET    /api/v1/cart
POST   /api/v1/cart/items
PUT    /api/v1/cart/items/{id}
DELETE /api/v1/cart/items/{id}
```

Addresses:

```text
GET    /api/v1/addresses
POST   /api/v1/addresses
PUT    /api/v1/addresses/{id}
DELETE /api/v1/addresses/{id}
POST   /api/v1/addresses/{id}/default
```

Orders:

```text
POST /api/v1/orders
GET  /api/v1/orders
GET  /api/v1/orders/{id}
POST /api/v1/orders/{id}/cancel
```

Payments:

```text
POST /api/v1/payments/initiate
GET  /api/v1/payments/{id}/status
POST /api/v1/payments/confirm
```

Health:

```text
GET /api/v1/health
GET /actuator/health
```

## Local Development

### Prerequisites

- Java 17
- Node.js 20+
- Docker Desktop
- MySQL client, optional
- Maven wrapper is included in `backend/`

### Run With Docker Compose

From the project root:

```powershell
docker compose up --build
```

Default service URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
MySQL:    localhost:3307
```

Default MySQL credentials for local Docker:

```text
Database: campuskart
Username: campuskart
Password: campuskart
Root password: root
```

### Run Backend Locally

Start MySQL first, then:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend profile defaults to `dev`.

### Run Frontend Locally

```powershell
cd frontend
npm install
npm run dev
```

Frontend development URL:

```text
http://localhost:5173
```

## Environment Variables

Backend reads values from Spring properties and environment variables:

```text
SPRING_PROFILES_ACTIVE
SERVER_PORT
DB_HOST
DB_PORT
DB_NAME
DB_USERNAME
DB_PASSWORD
JWT_SECRET
ACCESS_TOKEN_TTL
REFRESH_TOKEN_TTL
VERIFICATION_TOKEN_TTL
AUTH_ALLOWED_EMAIL_DOMAINS
CORS_ALLOWED_ORIGINS
```

Frontend `.env` example:

```text
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_BACKEND_ORIGIN=http://localhost:8080
```

Do not commit real secrets, production database credentials, or production JWT secrets.

## Git Ignore / Secret Safety

The repository ignores:

```text
node_modules/
frontend/dist/
backend/target/
.env
frontend/.env
backend/uploads/
uploads/
backend/src/main/resources/application-local.properties
backend/src/main/resources/application-secret.properties
backend/src/main/resources/application-secrets.properties
backend/src/main/resources/application-private.properties
backend/src/main/resources/application-prod.properties
```

Note: `application-prod.properties` should not contain real secrets in Git. Use environment variables or deployment secret managers for production values.

## Testing Status

Current automated backend test coverage is minimal.

Current state:

```text
Backend: one Spring context-load test
Frontend: no automated component/route tests yet
Coverage report: not configured
Business logic coverage: approximately 0%
Estimated total backend line coverage: under 5%
```

Recommended next tests:

- Auth service tests
- JWT service tests
- Product service tests
- Cart service tests
- Address service tests
- Order service tests
- Payment service tests
- Controller integration tests
- Security authorization tests
- Repository tests for key constraints

## CI/CD

GitHub Actions currently runs on pushes and pull requests to `main` and `master`.

Current CI jobs:

```text
Backend:
  - Set up Java 17
  - Run ./mvnw test

Frontend:
  - Set up Node.js 20
  - Run npm ci
  - Run npm run build
```

Current CI does not deploy the application yet.

Recommended CI improvements:

- Add `npm run lint`.
- Add frontend tests.
- Add backend coverage report with JaCoCo.
- Add Docker image build verification.
- Add deployment workflow after hosting target is selected.

## Payment Architecture

CampusKart currently uses a mock payment gateway.

The payment design is intentionally gateway-agnostic:

```text
PaymentService -> PaymentGateway -> MockPaymentGateway
```

This allows a future Razorpay implementation to be added behind the same interface without rewriting order/payment business logic.

Payment lifecycle:

```text
INITIATED -> CONFIRMED
INITIATED -> FAILED
```

Order lifecycle:

```text
PENDING_PAYMENT -> CONFIRMED
PENDING_PAYMENT -> CANCELLED
```

## Frontend Screens

Implemented screens:

- Home page with hero carousel and product grid
- Register
- Verify email
- Login
- Dashboard
- Product catalog
- Product detail
- Seller product list
- Seller product create
- Seller product edit
- Seller product image upload
- Cart
- Checkout
- Order history
- Order detail with mock payment controls
- Address management

## Known Notes

- The mock payment UI stores the active payment in page state. If the page is refreshed after initiating payment but before confirming it, the UI may lose the payment object. A future improvement is an endpoint like `GET /api/v1/payments/orders/{orderId}/latest`.
- Admin-specific functionality is not implemented yet because the original scope did not include an admin dashboard.
- Real email sending is not configured; development mode can expose/log verification token behavior.
- Local file upload storage is used for product images.

## License

This project is currently for learning and portfolio use.
