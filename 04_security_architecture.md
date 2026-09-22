# Security Architecture Document
## Travel Booking Website

---

## 1. Overview & Principles

Security is applied in layers (defense in depth) across the frontend, API, database, and infrastructure. Core principles:

- **Never trust the client** — all validation and authorization checks are enforced server-side, even if also done in React for UX.
- **Least privilege** — users and services only get the access they need.
- **Secure by default** — sensible defaults (HTTPS-only, short-lived tokens, hashed passwords) rather than opt-in security.
- **Fail securely** — errors don't leak sensitive details (stack traces, SQL, internal paths) to the client.

## 2. Authentication

| Aspect | Approach |
|---|---|
| Credential storage | Passwords hashed with **bcrypt** (or Argon2), never stored/logged in plain text |
| Login | Email + password verified against stored hash |
| Session mechanism | **JWT** (JSON Web Tokens) via Flask-JWT-Extended: short-lived **access token** (e.g., 15 min) + longer-lived **refresh token** (e.g., 7 days) |
| Token storage (frontend) | Access token kept in memory/React state; refresh token in an **HttpOnly, Secure, SameSite=Strict** cookie (not `localStorage`, to reduce XSS token-theft risk) |
| Token refresh | Refresh endpoint validates the refresh token and issues a new access token |
| Logout | Refresh token cookie cleared; access token blacklist (optional, via Redis) for immediate revocation if needed |
| Brute-force protection | Rate limiting + temporary lockout/backoff on repeated failed logins per account/IP |

## 3. Authorization

- **Role-based access control (RBAC)**: at minimum `user` and `admin` roles. Booking endpoints require `user` (or `admin`); listing-management endpoints (if an admin panel exists) require `admin`.
- Every protected endpoint checks:
  1. Is the request authenticated (valid JWT)?
  2. Does the authenticated user own the resource (e.g., can only view/cancel their *own* bookings) or hold the required role?
- Object-level checks (e.g., `booking.user_id == current_user.id`) are enforced server-side on every read/update/delete of a booking — not inferred from the frontend route.

## 4. Data Protection

| Aspect | Approach |
|---|---|
| Transport | TLS/HTTPS enforced everywhere (frontend↔backend, backend↔DB where supported); HTTP requests redirected to HTTPS |
| At rest | Database-level encryption at rest (managed by hosting provider, e.g., RDS encryption) |
| Secrets | Database credentials, JWT signing keys, payment/API keys stored in **environment variables** / a secrets manager — never committed to source control |
| PII minimization | Store only the user data actually needed (name, email); avoid storing raw payment card data at all (see §6) |
| Backups | Encrypted, access-restricted database backups on a regular schedule |

## 5. API Security

| Control | Detail |
|---|---|
| Input validation | All request bodies validated against schemas (Marshmallow/Pydantic) before touching business logic — rejects malformed/unexpected fields |
| SQL injection prevention | All queries via SQLAlchemy ORM / parameterized queries — no raw string-built SQL |
| CORS | Flask-CORS configured to allow only the known frontend origin(s), not `*` |
| CSRF | Since auth uses a Bearer access token for API calls (not cookie-based for the access token), CSRF risk is reduced; the refresh-token cookie uses `SameSite=Strict`/`Lax` and CSRF double-submit protection if cookie-based flows are used |
| Rate limiting | Flask-Limiter (or equivalent) on auth endpoints (login/register) and booking creation to prevent abuse/scraping |
| Security headers | `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security` set on API responses |
| Output encoding | React escapes rendered content by default (mitigates XSS); avoid `dangerouslySetInnerHTML` unless content is sanitized |
| Error handling | Generic error messages returned to clients; detailed errors/stack traces only in server-side logs, never in the HTTP response |

## 6. Payment Security

- Payment card data is **never** handled or stored directly by this application.
- Integration with a PCI-DSS-compliant payment gateway (e.g., Stripe/Razorpay) using their hosted checkout / tokenization (e.g., Stripe Elements), so raw card numbers never touch the Flask backend.
- The backend only stores a payment/transaction **reference ID** and status, not card details.
- Webhook endpoints (if used, e.g., payment confirmation callbacks) verify the provider's signature before trusting the payload.

## 7. Session Management

- Access tokens are short-lived to limit the window of misuse if leaked.
- Refresh tokens are rotated on use (old refresh token invalidated once a new one is issued) to limit replay risk.
- Users can view and revoke active sessions in a future iteration (not required for v1, noted as a possible enhancement).

## 8. Infrastructure Security

- Application server (Flask/Gunicorn) not directly exposed to the internet — sits behind Nginx as a reverse proxy.
- Database not publicly accessible; only reachable from the application server's network/VPC.
- Firewall rules restrict inbound traffic to required ports only (443/80 at the edge, DB port only from app servers).
- Dependencies (`pip`, `npm` packages) scanned periodically for known vulnerabilities (e.g., `pip-audit`, `npm audit`, or Dependabot).
- Regular OS/package updates on servers/containers.

## 9. Logging & Monitoring

- Structured application logs (request path, status code, user id where relevant) — **never log passwords, tokens, or full card data**.
- Failed login attempts, booking failures, and 4xx/5xx spikes monitored/alerted on.
- An audit trail for sensitive actions (booking creation/cancellation, admin changes) for troubleshooting and accountability.

## 10. Privacy & Compliance Considerations

- Collect only necessary personal data (name, email, booking details) and state its use in a privacy policy (to be added to the About/Contact area).
- Provide a mechanism for account/data deletion requests, aligned with general data-protection good practice (relevant if operating under regulations such as GDPR, depending on target users' jurisdiction).
- Contact form submissions treated as personal data too — retained only as long as needed for support purposes.

## 11. Security Checklist (build-time)

- [ ] HTTPS enforced in all environments (including local dev where practical)
- [ ] Passwords hashed with bcrypt/Argon2, salted automatically by the library
- [ ] JWT secrets stored in environment variables, rotated periodically
- [ ] CORS restricted to known origins
- [ ] Rate limiting on auth and booking endpoints
- [ ] All inputs validated server-side via schemas
- [ ] ORM used exclusively for DB access (no raw SQL string interpolation)
- [ ] Security headers set on all API responses
- [ ] No sensitive data (passwords, tokens, card numbers) in logs
- [ ] Dependency vulnerability scanning enabled in CI
- [ ] Payment card data never touches the backend directly
