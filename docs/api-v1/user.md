# Người dùng (v1)

Base path: `/api/v1/users`

Tất cả route dưới đây (trừ khi ghi chú) cần header **`Authorization: Bearer <accessToken>`**.

## Endpoints

| Method | Path | Role | Mô tả |
|--------|------|------|--------|
| GET | `/current` | `admin` hoặc `user` | Thông tin user đang đăng nhập |
| PUT | `/current` | `admin` hoặc `user` | Cập nhật profile (username, email, password, tên, social links — xem validator trong code) |
| DELETE | `/current` | `admin` hoặc `user` | Xóa tài khoản hiện tại (204) |
| GET | `/` | **admin** | Danh sách user; query `limit` (1–50), `offset` (≥0) |
| GET | `/:userId` | **admin** | Chi tiết user theo Mongo ObjectId |
| DELETE | `/:userId` | **admin** | Xóa user theo ID (204); xử lý blog/banner liên quan trong controller |

## Ghi chú

- `limit` / `offset` là tùy chọn nhưng khi gửi phải thỏa rule số nguyên trong validator.
- Cập nhật `PUT /current` có kiểm tra trùng `username` / `email` và URL cho các field social.

Chi tiết: [openapi.json](../openapi.json).
