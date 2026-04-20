# 👤 Users (v1)

Base path: `/api/v1/users`

All routes below require the **`Authorization: Bearer <accessToken>`** header unless noted otherwise.

## 📡 Endpoints

| Method | Path | Role | Description |
|--------|------|------|-------------|
| 🟢 GET | `/current` | `admin` or `user` | Current authenticated user |
| 🟡 PUT | `/current` | `admin` or `user` | Update profile (username, email, password, names, social links — see validators in code) |
| 🔴 DELETE | `/current` | `admin` or `user` | Delete the current account |
| 🟢 GET | `/` | **admin** | List users; query `limit` (1–50), `offset` (≥ 0) |
| 🟢 GET | `/:userId` | **admin** | User by Mongo ObjectId |
| 🔴 DELETE | `/:userId` | **admin** | Delete user by ID; related blogs/banners handled in the controller |

## 🚦 Status codes

| Status | Meaning |
|--------|---------|
| 🟢 200 | Success with body |
| 🟢 204 | Delete success (no body) |
| 🟡 400 | Validation error (duplicate username/email, invalid URL, etc.) |
| 🟠 401 | Missing / invalid access token |
| 🟠 403 | Insufficient role (admin-only endpoints) |
| 🔎 404 | User not found |
| 🔴 500 | Server error |

## 🧾 Notes

- `limit` and `offset` are optional, but when sent they must satisfy the integer rules in the validators.
- `PUT /current` checks for duplicate `username` / `email` and validates URLs for social fields.

Details: [openapi.json](../openapi.json).
