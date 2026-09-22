# System Workflow Document
## Travel Booking Website

This document describes the key end-to-end workflows through the system: React frontend → Flask REST API → PostgreSQL.

---

## 1. User Registration & Login

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React App
    participant API as Flask API
    participant DB as PostgreSQL

    U->>FE: Fill signup form (name, email, password)
    FE->>API: POST /api/auth/register
    API->>DB: Check if email exists
    DB-->>API: Not found
    API->>API: Hash password (bcrypt)
    API->>DB: Insert new user
    DB-->>API: User created
    API-->>FE: 201 Created (user info)
    FE-->>U: Redirect to Login / auto-login

    U->>FE: Enter email + password
    FE->>API: POST /api/auth/login
    API->>DB: Look up user by email
    DB-->>API: User record (hashed password)
    API->>API: Verify password hash
    API->>API: Generate access + refresh JWT
    API-->>FE: 200 OK (tokens + user profile)
    FE->>FE: Store tokens, update AuthContext
    FE-->>U: Redirect to Home (logged in)
```

## 2. Destination / Hotel Search

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React App
    participant API as Flask API
    participant DB as PostgreSQL

    U->>FE: Enter search query + filters (dates, price)
    FE->>API: GET /api/destinations?query=&checkin=&checkout=&price_max=
    API->>DB: Query destinations/hotels matching filters
    DB-->>API: Matching rows
    API-->>FE: 200 OK (results list, pagination info)
    FE-->>U: Render results (list + optional map view)
```

## 3. Hotel Booking

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React App
    participant API as Flask API
    participant DB as PostgreSQL
    participant PAY as Payment Gateway

    U->>FE: Open hotel detail, choose dates/room
    FE->>API: GET /api/hotels/:id (+ availability)
    API->>DB: Fetch hotel + room availability
    DB-->>API: Hotel + rooms
    API-->>FE: 200 OK
    U->>FE: Click "Book Now"
    alt Not logged in
        FE-->>U: Redirect to Login, return to booking after
    end
    FE->>API: POST /api/bookings/hotel {room_id, dates, guests}
    API->>DB: Check room availability (lock/verify)
    DB-->>API: Available
    API->>PAY: Create payment intent / charge (if payments enabled)
    PAY-->>API: Payment confirmed
    API->>DB: Insert booking + hotel_booking record
    DB-->>API: Booking saved
    API-->>FE: 201 Created (booking confirmation)
    FE-->>U: Show confirmation page
```

## 4. Ticket Booking

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React App
    participant API as Flask API
    participant DB as PostgreSQL

    U->>FE: Browse tickets for a destination
    FE->>API: GET /api/tickets?destination_id=
    API->>DB: Query tickets
    DB-->>API: Ticket list
    API-->>FE: 200 OK
    U->>FE: Select ticket + quantity/date, confirm
    FE->>API: POST /api/bookings/ticket {ticket_id, quantity, date}
    API->>DB: Verify availability, insert booking + ticket_booking
    DB-->>API: Saved
    API-->>FE: 201 Created (confirmation)
    FE-->>U: Show confirmation
```

## 5. Travel Guide Booking

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React App
    participant API as Flask API
    participant DB as PostgreSQL

    U->>FE: Browse guides for a destination
    FE->>API: GET /api/guides?destination_id=
    API->>DB: Query guide profiles
    DB-->>API: Guide list
    API-->>FE: 200 OK
    U->>FE: Open guide profile, request date/time
    FE->>API: POST /api/bookings/guide {guide_id, date, time_slot}
    API->>DB: Check guide availability, insert booking + guide_booking
    DB-->>API: Saved (status: pending/confirmed)
    API-->>FE: 201 Created
    FE-->>U: Show booking status
```

## 6. Map Interaction

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React App (Map view)
    participant API as Flask API
    participant DB as PostgreSQL
    participant MAP as Map Provider (tiles/geocoding)

    U->>FE: Open Map page / pan-zoom
    FE->>MAP: Fetch map tiles
    FE->>API: GET /api/map/points?bounds=
    API->>DB: Query destinations/hotels/attractions in bounds
    DB-->>API: Points list (lat/lng + summary)
    API-->>FE: 200 OK
    FE-->>U: Render markers on map
    U->>FE: Click marker
    FE-->>U: Show summary card, link to detail/booking page
```

## 7. Contact Form Submission

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React App
    participant API as Flask API
    participant DB as PostgreSQL
    participant MAIL as Email Service (optional)

    U->>FE: Fill contact form (name, email, message)
    FE->>API: POST /api/contact
    API->>DB: Store contact_messages record
    API->>MAIL: (optional) Notify support / auto-reply
    API-->>FE: 200 OK
    FE-->>U: Show "message sent" confirmation
```

## 8. My Bookings View

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React App
    participant API as Flask API
    participant DB as PostgreSQL

    U->>FE: Open "My Bookings"
    FE->>API: GET /api/bookings/me (with auth token)
    API->>API: Verify JWT
    API->>DB: Query bookings for user (joined with hotel/ticket/guide details)
    DB-->>API: Bookings list
    API-->>FE: 200 OK
    FE-->>U: Render bookings grouped by type/status
```

## 9. Cross-Cutting: Auth Token Refresh (background flow)

```mermaid
sequenceDiagram
    participant FE as React App
    participant API as Flask API

    FE->>API: Any request with expired access token
    API-->>FE: 401 Unauthorized (token expired)
    FE->>API: POST /api/auth/refresh (refresh token)
    API-->>FE: 200 OK (new access token)
    FE->>API: Retry original request
```

This transparent refresh flow keeps users logged in across a session without forcing repeated logins, while access tokens remain short-lived for security (see Security Architecture document).
