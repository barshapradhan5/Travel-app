# Technology Stack Document
## Travel Booking Website

---

## 1. Frontend

| Layer | Technology | Purpose |
|---|---|---|
| Core framework | **React** (with Vite or Create React App as build tool — Vite recommended for speed) | UI library / SPA |
| Routing | `react-router-dom` | Client-side page routing |
| Styling | **Tailwind CSS** (or CSS Modules) | Utility-first styling, consistent design system |
| Server-state / data fetching | `@tanstack/react-query` (or SWR) | Caching, loading/error states for API calls |
| Client-state | React Context (+ `useReducer` where needed) | Auth state, UI state |
| HTTP client | `axios` | API requests, interceptors for auth token + refresh |
| Forms & validation | `react-hook-form` + `yup`/`zod` | Login/signup/booking/contact forms |
| Maps (frontend) | `react-leaflet` (OpenStreetMap) **or** `@react-google-maps/api` **or** Mapbox GL JS — *pending your choice* | Interactive map page |
| Animation/effects | **Pending your input** — candidates: `framer-motion` (page/component transitions, micro-interactions), `AOS` (scroll-reveal animations), `GSAP` (complex/timeline animations) | Animations & UI effects requested in the brief |
| Icons | `lucide-react` or `react-icons` | UI icons |
| Testing | `Jest` + `React Testing Library` | Unit/integration tests |

## 2. Backend

| Layer | Technology | Purpose |
|---|---|---|
| Core framework | **Flask** (Python) | REST API server |
| ORM | `Flask-SQLAlchemy` | Database models & queries |
| Migrations | `Alembic` (via `Flask-Migrate`) | Schema version control |
| Validation/serialization | `Marshmallow` or `Pydantic` | Request/response schema validation |
| Authentication | `Flask-JWT-Extended` | JWT access/refresh tokens |
| Password hashing | `bcrypt` / `passlib` | Secure password storage |
| CORS | `Flask-CORS` | Cross-origin requests from the React app |
| Rate limiting | `Flask-Limiter` | Abuse prevention on auth/booking endpoints |
| WSGI server (prod) | `Gunicorn` | Production application server |
| Background jobs (optional) | `Celery` + `Redis` | Async tasks (e.g., sending confirmation emails) |
| Testing | `pytest` + `pytest-flask` | Unit/integration tests |

## 3. Database

| Layer | Technology | Purpose |
|---|---|---|
| Primary database | **PostgreSQL** | System of record for users, listings, bookings |
| Caching (optional) | `Redis` | Session/token blacklist, cached search results |
| Connection pooling (as load grows) | `PgBouncer` | Efficient DB connections under scale |

## 4. Third-Party Services

| Service | Purpose | Status |
|---|---|---|
| Map provider (Google Maps / Mapbox / Leaflet+OSM) | Rendering the map page, geocoding | **Pending your choice** |
| Payment gateway (e.g., Stripe, Razorpay) | Booking checkout | **Pending your choice** |
| Email service (e.g., SendGrid, SMTP) | Booking confirmations, contact form notifications | Optional for v1 |

## 5. DevOps / Infrastructure

| Layer | Technology | Purpose |
|---|---|---|
| Containerization | `Docker` + `docker-compose` | Local dev parity, consistent deployments |
| Reverse proxy | `Nginx` | Serves frontend build, proxies API requests, TLS termination |
| CI/CD | `GitHub Actions` (or similar) | Lint/test on PR, deploy on merge |
| Hosting (examples) | Frontend: Netlify/Vercel/S3+CloudFront · Backend: Render/Railway/AWS (EC2/ECS)/Heroku · DB: managed PostgreSQL (e.g., RDS, Render, Supabase) | Deployment targets (final choice open) |
| Monitoring/logging | e.g., Sentry (errors), basic structured logging | Observability |

## 6. Version Control & Collaboration

| Tool | Purpose |
|---|---|
| Git + GitHub | Source control |
| `.env` files (per environment, git-ignored) | Local/staging/production configuration |
| README / API docs (e.g., simple Markdown or Swagger/OpenAPI) | Onboarding and API reference |

## 7. Summary Table (at a glance)

| Concern | Choice |
|---|---|
| Frontend framework | React |
| Backend framework | Flask (Python) |
| Database | PostgreSQL |
| Auth | JWT (Flask-JWT-Extended) + bcrypt |
| Styling | Tailwind CSS |
| Map | **Open — needs your decision** |
| Payments | **Open — needs your decision** |
| Animation library | **Open — needs your decision** |
| Deployment | Docker + Nginx + Gunicorn, managed Postgres |

---

### Items needing your confirmation before implementation begins
1. **Animation library** — Framer Motion (recommended default for React), GSAP, or AOS?
2. **Map provider** — Google Maps (paid, feature-rich), Mapbox (paid, stylable), or Leaflet + OpenStreetMap (free)?
3. **Payment gateway** — Stripe, Razorpay, or none for v1 (booking confirmation without real payment)?
4. **Hosting targets** — any preferred provider, or open to a recommendation?
