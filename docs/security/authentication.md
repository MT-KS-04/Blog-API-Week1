# 🔐 Authentication and tokens

## 🎟️ Access token (JWT)

- Sent in the header: **`Authorization: Bearer <access_token>`** (space after `Bearer`).
- Payload includes `userId` (Mongo ObjectId); signed with `JWT_ACCESS_SECRET`, lifetime `ACCESS_TOKEN_EXPIRY` (`ms`-style / `jsonwebtoken`, e.g. `15m`).
- The `authenticate` middleware returns 🟠 **401** with `code: AuthenticationError` when the Bearer prefix is missing, the token is expired, or invalid.

{% hint style="warning" %}
Always use the exact `Bearer ` + token format; missing or malformed headers yield 🟠 `401`.
{% endhint %}

## 🔄 Refresh token

- Separate JWT, signed with `JWT_REFRESH_SECRET`, TTL `REFRESH_TOKEN_EXPIRY`.
- A row is stored in the **Token** collection and an httpOnly **`refreshToken`** cookie is set (`secure` when `NODE_ENV=production`, `sameSite: strict`).
- `POST /api/v1/auth/refresh-token` reads the cookie — do not use Bearer for this step.

## 🚪 Logout

`POST /api/v1/auth/logout` requires Bearer auth; removes the refresh token from the database and clears the cookie.

## 🌍 CORS

Allowed origins are defined in `config.WHITELIST_ORIGINS` in source. In `development`, or when the `Origin` header is absent, CORS behavior is more permissive — see `src/server.ts` and `src/config/index.ts` for production hardening.

## 🛡️ Other HTTP protections

- **Helmet** is applied to routes registered after Swagger (security-related headers).
- **express-rate-limit:** 100 requests per 15 minutes per IP (global). Swagger UI is mounted before the limiter, so loading `/api-docs` is not counted against the same limiter bucket as API traffic under the current setup.

Endpoint details: [openapi.json](../openapi.json).
