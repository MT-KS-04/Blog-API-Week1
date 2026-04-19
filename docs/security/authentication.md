# Xác thực và token

## Access token (JWT)

- Gửi qua header: **`Authorization: Bearer <access_token>`** (có khoảng sau `Bearer`).
- Payload chứa `userId` (Mongo ObjectId); ký bằng `JWT_ACCESS_SECRET`, thời hạn `ACCESS_TOKEN_EXPIRY` (chuỗi dạng `ms` / `jsonwebtoken`, ví dụ `15m`).
- Middleware `authenticate` từ chối nếu thiếu prefix Bearer, token hết hạn, hoặc không hợp lệ — thường trả **401** với `code: AuthenticationError`.

> [!warning]
> Luôn gửi đúng dạng `Bearer ` + token; thiếu hoặc sai định dạng sẽ 401.

## Refresh token

- Là JWT riêng, ký bằng `JWT_REFRESH_SECRET`, TTL `REFRESH_TOKEN_EXPIRY`.
- Lưu bản ghi trong collection **Token** và đồng thời set cookie **`refreshToken`** (httpOnly, `secure` khi `NODE_ENV=production`, `sameSite: strict`).
- Endpoint `POST /api/v1/auth/refresh-token` đọc cookie — không dùng Bearer cho bước này.

## Đăng xuất

`POST /api/v1/auth/logout` cần Bearer; xóa refresh trong DB và `clearCookie`.

## CORS

Origin được phép hiện đang khai báo trong `config.WHITELIST_ORIGINS` (mã nguồn). Môi trường `development` hoặc request không có header `Origin` có logic nới trong CORS — xem `src/server.ts` và `src/config/index.ts` khi triển khai production.

## Bảo vệ HTTP khác

- **Helmet** bật cho các route sau Swagger (header bảo mật).
- **express-rate-limit:** 100 request / 15 phút / IP (toàn app, trừ thứ tự middleware — Swagger UI đặt trước limiter nên tải `/api-docs` không bị tính vào cùng chồng limit như API nếu cấu hình hiện tại).

Chi tiết endpoint: [openapi.json](../openapi.json).
