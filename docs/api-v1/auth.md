# Authentication (v1)

Base path: `/api/v1/auth`

## Endpoints

| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/register` | Tạo tài khoản; username do server sinh; cookie `refreshToken` + body có `accessToken` |
| POST | `/login` | Đăng nhập email/mật khẩu; set cookie + `accessToken` |
| POST | `/refresh-token` | Cấp access token mới từ cookie `refreshToken` (JWT) |
| POST | `/logout` | Cần header Bearer; xóa refresh token trong DB và xóa cookie |

## Request / response

- **Register / Login (JSON):** `email`, `password` (tối thiểu **8** ký tự theo rule validator; một số message lỗi trong code vẫn có thể nói "20 characters" — hãy tin rule min 8).
- **Register:** có thể gửi thêm `role` (`admin` \| `user`). Đăng ký `admin` chỉ được nếu email nằm trong whitelist trong config server.
- **Refresh:** không dùng Bearer; gửi cookie `refreshToken` (httpOnly; `secure` khi `NODE_ENV=production`; `sameSite=strict`).
- **Logout:** header `Authorization: Bearer <accessToken>`.

> [!warning]
> Trong response register/login, object `user` có thể chứa field `password` (dạng hash) theo implementation hiện tại — client không nên hiển thị hoặc log.

## Luồng refresh (tóm tắt)

1. Login/Register lưu refresh JWT vào collection `Token` và set cookie `refreshToken`.
2. Client gọi `POST /auth/refresh-token` với cookie — nhận JSON `{ accessToken }`.
3. Logout xóa bản ghi token và `clearCookie`.

Chi tiết schema: xem [openapi.json](../openapi.json) và Swagger UI `/api-docs`.
