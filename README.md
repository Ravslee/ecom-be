# Express + Mongoose E‑commerce Backend

Features:
- Mongoose models that follow provided ER diagram
- JWT authentication (register/login)
- REST API for products, cart, orders
- Seed script for initial data
- Basic input validation

## Quick start
1. Copy `.env.example` -> `.env` and set values.
2. `npm install`
3. `npm run seed`
4. `npm run dev`

## Endpoints (high level)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/cart/items` (protected)
- `POST /api/orders` (protected)

