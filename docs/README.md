# 📘 Blog API

REST API for a blog platform, built with **Node.js**, **TypeScript**, **Express 5**, **MongoDB** (Mongoose), **JWT** authentication (access token + refresh cookie), and **Cloudinary** for banner uploads.

This backend is documented for API consumers: endpoints, auth usage, request/response behavior, and error handling.

## ✨ What This API Includes

- Register, login, refresh access token, logout
- User management (profile, admin-only listing and deletion)
- Blog CRUD (slug, `draft` / `published`, multipart banner)
- Comments on posts
- Like / unlike posts
- Security defaults: Helmet, CORS, global rate limiting, validator middleware

## 🧱 API Flow At A Glance

- Clients call versioned endpoints under `/api/v1`
- Protected endpoints require Bearer access token
- Token refresh is handled with `refreshToken` cookie on the refresh endpoint
- OpenAPI contract is published in `docs/openapi.json` and served at `/api-docs`

See the high-level flow in [Architecture](architecture.md).

## 🩺 Authentication And Security Highlights

- Access token via `Authorization: Bearer <token>`
- Refresh token via httpOnly `refreshToken` cookie
- Request validation with `express-validator`
- Standard protection headers and global rate limiting

## 🔗 Base URL And Version

- API prefix: **`/api/v1/`** (example: `https://your-host/api/v1/auth/login`)

### 🧪 Health check (no authentication)

`GET /api/v1/` returns `message`, `status`, `version`, `environment`, `uptime`, `server`, `docs`, and `timestamp`. Use it as a quick readiness and post-deploy verification endpoint.

## 🚀 Start Here

- [Installation and environment](installation.md)
- [Architecture](architecture.md)
- [OpenAPI and Swagger](openapi.md)
- [Authentication API](api-v1/auth.md)
- [Database schema](database/schema.md)
- [Security and tokens](security/authentication.md)

## 📚 Documentation Notes

- Swagger UI (when server is running): open `{origin}/api-docs`
- OpenAPI source: [openapi.json](openapi.json)
- Regenerate spec after API contract changes: `npm run generate:openapi` or `npm run build`

{% hint style="success" %}
After any endpoint change, regenerate and commit `docs/openapi.json` together with the code change so GitBook and Swagger stay synchronized.
{% endhint %}
