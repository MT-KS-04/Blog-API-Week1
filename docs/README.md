# 📘 Blog API

REST API for a blog platform, built with **Node.js**, **TypeScript**, **Express 5**, **MongoDB** (Mongoose), **JWT** authentication (access token + refresh cookie), and **Cloudinary** for banner uploads.

## ✨ Features

- Register, login, refresh access token, logout
- User management (profile, admin-only listing and deletion)
- Blog CRUD (slug, `draft` / `published`, multipart banner)
- Comments on posts
- Like / unlike posts
- Global rate limiting (`express-rate-limit`), Helmet, CORS with an allowlist

## 🔗 Base URL and version

- API prefix: **`/api/v1/`** (example: `https://your-host/api/v1/auth/login`).

### 🩺 Health check (no authentication)

`GET /api/v1/` returns a JSON payload with `message`, `status`, `version`, `environment`, `uptime`, `server`, `docs` (documentation URL), and `timestamp`. Use it for monitoring or a quick post-deploy check.

## 📚 Documentation

- [Installation and environment](installation.md)
- **Swagger UI** (when the server is running): open `{origin}/api-docs` to explore and test endpoints.
- OpenAPI source: [openapi.json](openapi.json) — regenerate with `npm run generate:openapi` (or `npm run build`) after changing router `@openapi` JSDoc blocks.

{% hint style="success" %}
After any endpoint change, run `npm run generate:openapi` and commit `docs/openapi.json` together with the code change so GitBook and Swagger stay synchronized.
{% endhint %}
