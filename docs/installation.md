# Installation

## Requirements

- **Node.js** 22 (matches the Dockerfile) or a compatible LTS
- **MongoDB** (Atlas or local) â€” connection string via environment variables

## Install dependencies

```bash
npm install
```

## Environment variables

Create a `.env` file in the project root (do not commit real secrets). Variable names follow `.env.example` in the repository:

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (defaults may use 3000 in code) |
| `NODE_ENV` | `development` \| `production` \| `test` |
| `MONGOOSE_URL` | MongoDB connection string (**not** `MONGO_URI` unless you change the code) |
| `LOG_LEVELS` | Winston log level (e.g. `info`) |
| `JWT_ACCESS_SECRET` | Secret used to sign access JWTs |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh JWTs |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime (`ms`-style string, e.g. `15m`) |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

> [!warning]
> ⚠️ Never paste real secrets into public documentation or GitBook â€” document variable names only.

**CORS:** allowed origins are configured in source (`config.WHITELIST_ORIGINS`). For a new production domain, update the code or refactor to read from environment variables.

## OpenAPI for Swagger UI

The server loads the spec from `docs/openapi.json`. Before the first run, or after editing `@openapi` JSDoc on routers:

```bash
npm run generate:openapi
```

Or run a full build (which runs generate first):

```bash
npm run build
```

## Run the application

- **Development (nodemon + ts-node):** `npm start`  
  This project does **not** define `npm run dev`; use `npm start`.

- **Production (after `npm run build`):** `npm run start:prod`  
  Runs `node dist/server.js` â€” requires MongoDB and a valid `.env`.

## Docker

The repository includes a `Dockerfile`: the build stage runs `npm run build` (including OpenAPI generation), and the runtime image copies both `dist/` and `docs/` so `/api-docs` can read `openapi.json`.

```bash
docker compose up --build
```

(Adjust if you use `docker build` directly.)

## Quick verification

1. `GET http://localhost:<PORT>/api/v1/` â€” expect `200` when the server and database are connected.
2. `GET http://localhost:<PORT>/api-docs` â€” Swagger UI.
