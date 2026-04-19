# Authentication (v1)

Base path: `/api/v1/auth`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Create an account; server-generated username; sets `refreshToken` cookie; response includes `accessToken` |
| POST | `/login` | Email/password login; sets cookie and returns `accessToken` |
| POST | `/refresh-token` | Issue a new access token using the `refreshToken` cookie (JWT) |
| POST | `/logout` | Requires `Authorization: Bearer`; removes refresh token from the database and clears the cookie |

## Request and response

- **Register / login (JSON):** `email`, `password` (minimum **8** characters per validator rules; some error messages in code may still say "20 characters" — trust the minimum length of 8).
- **Register:** optional `role` (`admin` \| `user`). Registering as `admin` is only allowed if the email is on the server allowlist in config.
- **Refresh:** do not use Bearer; send the `refreshToken` cookie (httpOnly; `secure` when `NODE_ENV=production`; `sameSite=strict`).
- **Logout:** header `Authorization: Bearer <accessToken>`.

> [!warning]
> Register/login responses may include a `password` field on the `user` object (hashed) in the current implementation — clients must not display or log it.

## Refresh flow (summary)

1. Login/register persists the refresh JWT in the `Token` collection and sets the `refreshToken` cookie.
2. The client calls `POST /auth/refresh-token` with the cookie and receives `{ accessToken }`.
3. Logout deletes the token record and calls `clearCookie`.

For full schemas, see [openapi.json](../openapi.json) and Swagger UI at `/api-docs`.
