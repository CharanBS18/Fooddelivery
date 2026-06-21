# Food Delivery App: Production Implementation Guide

## 1) Step-by-step implementation plan

1. Baseline setup
- Keep frontend in root (`Vite`).
- Add backend in `backend/` (`Express + Mongoose + JWT + Razorpay`).
- Configure env files from `.env.example` and `backend/.env.example`.

2. Auth foundation
- Implement signup/login with hashed password (`bcryptjs`).
- Generate JWT access tokens and protect private APIs using middleware.
- Add optional OTP later using Redis + Twilio/Firebase Auth phone verification.

3. Core domain APIs
- Implement `restaurants`, `menu-items`, `cart`, `orders`, `payments`, `users` modules.
- Apply request validation (`zod`) and consistent API response shape.

4. Cart and ordering flow
- Store cart server-side in MongoDB.
- Create order from cart snapshot (`Order + OrderItem`) so price changes do not affect old orders.

5. Payment flow (Razorpay)
- Create provider order from backend.
- Open Razorpay checkout in frontend.
- Verify signature in backend and update order status to `PREPARING`.
- Add webhook verification for resilient payment confirmation.

6. Delivery workflow
- Staff/admin update status `PREPARING -> OUT_FOR_DELIVERY -> DELIVERED`.
- Optional map tracking can be added through a delivery location service.

7. Frontend integration
- Use API client wrappers in `src/api/*` and centralized `apiFetch`.
- Handle loading/error states around each async action.

8. Hardening and deploy
- Add logging, rate limits, CORS allowlist, secrets management.
- Deploy frontend and backend separately.

---

## 2) Folder structure (frontend + backend)

```text
.
├── src/
│   ├── api/
│   │   ├── auth.api.js
│   │   ├── cart.api.js
│   │   ├── order.api.js
│   │   ├── payment.api.js
│   │   └── restaurant.api.js
│   ├── config/
│   │   └── api.js
│   └── lib/
│       ├── http.js
│       └── razorpay.js
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── common/
│   │   │   ├── constants/order-status.js
│   │   │   └── utils/{ApiError,ApiResponse,asyncHandler}.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── routes/index.js
│   │   └── modules/
│   │       ├── auth/
│   │       ├── users/
│   │       ├── restaurants/
│   │       ├── menuItems/
│   │       ├── cart/
│   │       ├── orders/
│   │       └── payments/
│   └── .env.example
└── PRODUCTION_IMPLEMENTATION_GUIDE.md
```

---

## 3) Database schema definitions

Implemented models:
- `User`: identity, role, phone, address book, password hash
- `Restaurant`: profile, cuisines, address, rating, active status
- `MenuItem`: restaurant ref, name, price, availability
- `Cart`: user ref, cart item snapshots, total
- `Order`: user, restaurant, order items refs, totals, payment state, delivery address, status
- `OrderItem`: immutable item snapshot for a placed order

Status enum:
- `PENDING_PAYMENT`
- `PREPARING`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `CANCELLED`

---

## 4) API routes + request/response examples

Base: `/api/v1`

Auth:
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

Example request:
```json
{
  "name": "Charan",
  "email": "charan@example.com",
  "password": "StrongPass123",
  "phone": "9999999999"
}
```

Example response:
```json
{
  "success": true,
  "message": "Signup successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Charan",
      "email": "charan@example.com",
      "role": "customer"
    },
    "accessToken": "jwt-token"
  }
}
```

Restaurants:
- `GET /restaurants`
- `GET /restaurants/:restaurantId`
- `POST /restaurants` (admin)

Menu items:
- `GET /menu-items?restaurantId=:id`
- `GET /menu-items/:menuItemId`
- `POST /menu-items` (admin)

Cart:
- `GET /cart`
- `PUT /cart/items` `{ menuItemId, quantity }`
- `DELETE /cart/items/:menuItemId`
- `DELETE /cart`

Orders:
- `POST /orders` with `deliveryAddress` (creates order from cart)
- `GET /orders`
- `GET /orders/:orderId`
- `PATCH /orders/:orderId/status` (admin/delivery)

Payments (Razorpay):
- `POST /payments/razorpay/order` `{ orderId }`
- `POST /payments/razorpay/verify` `{ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }`
- `POST /payments/razorpay/webhook`

---

## 5) Payment integration flow (Razorpay)

1. Customer creates order (`POST /orders`) from cart.
2. Frontend calls `POST /payments/razorpay/order`.
3. Backend creates Razorpay order and returns `razorpayOrderId`.
4. Frontend opens checkout (`src/lib/razorpay.js`).
5. On success, frontend sends signature payload to `POST /payments/razorpay/verify`.
6. Backend verifies HMAC signature, marks `isPaid=true`, sets status `PREPARING`, clears cart.
7. Webhook (`payment.captured`) provides backup confirmation path.

---

## 6) Frontend integration pattern

Use the new API wrappers:
- `authApi.login/signup/me`
- `restaurantApi.list/menu`
- `cartApi.get/upsertItem/removeItem`
- `orderApi.create/listMine/getById/updateStatus`
- `paymentApi.createRazorpayOrder/verifyRazorpayPayment`

Recommended UI state pattern per screen:
- `isLoading`: disable actions/spinners
- `error`: show toast/inline error from `Error.message`
- `data`: optimistic update where safe (cart qty), then refetch to confirm

---

## 7) Deployment guide

Backend:
1. Create production MongoDB (Atlas).
2. Set backend env vars (`MONGODB_URI`, `JWT_ACCESS_SECRET`, Razorpay secrets, `FRONTEND_ORIGIN`).
3. Deploy `backend/` to Render/Railway/Fly/EC2.
4. Expose HTTPS API and configure CORS allowlist.

Frontend:
1. Set `VITE_API_BASE_URL` and `VITE_RAZORPAY_KEY_ID`.
2. Deploy Vite app on Vercel/Netlify.
3. Ensure backend URL is reachable from browser.

Secrets:
- Never commit `.env` files.
- Rotate JWT and payment secrets periodically.
- Use platform secret manager.

---

## 8) Common pitfalls and best practices

Pitfalls:
- Using client-side amount for payment verification.
- Updating order totals after payment initiation.
- Not snapshotting menu item price/name in order.
- Missing idempotency checks in payment webhook handlers.
- Allowing multi-restaurant cart without explicit business logic.

Best practices:
- Keep controllers thin, business logic in services.
- Validate every request body/params/query.
- Always verify payment signatures server-side.
- Use role-based authorization middleware.
- Add integration tests for checkout and payment verification.
- Add background jobs for retries/notifications.

---

## 9) Run locally

Backend:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Frontend:
```bash
npm install
cp .env.example .env
npm run dev
```

