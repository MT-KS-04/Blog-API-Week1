# Blog API

REST API cho nền tảng blog, xây dựng bằng **Node.js**, **TypeScript**, **Express 5**, **MongoDB** (Mongoose), xác thực **JWT** (access token + refresh cookie), upload banner qua **Cloudinary**.

## Tính năng chính

- Đăng ký / đăng nhập / làm mới access token / đăng xuất
- Quản lý người dùng (profile, danh sách và xóa theo quyền admin)
- CRUD blog (slug, trạng thái draft/published, banner multipart)
- Bình luận theo bài viết
- Like / Unlike bài viết
- Giới hạn tốc độ request toàn cục (`express-rate-limit`), Helmet, CORS có whitelist

## Base URL và phiên bản

- Tiền tố API: **`/api/v1/`** (ví dụ: `https://your-host/api/v1/auth/login`).

### Health check (không cần đăng nhập)

`GET /api/v1/` trả về JSON trạng thái dịch vụ: `message`, `status`, `version`, `environment`, `uptime`, `server`, `docs` (URL tài liệu), `timestamp`. Dùng cho monitoring hoặc kiểm tra nhanh sau deploy.

## Tài liệu kỹ thuật

- [Cài đặt và biến môi trường](installation.md)
- **Swagger UI** (khi server chạy): mở `{origin}/api-docs` để thử request và xem schema sinh từ OpenAPI.
- File spec: [openapi.json](openapi.json) — cập nhật bằng `npm run generate:openapi` (hoặc `npm run build`) sau khi đổi JSDoc trên router.

> [!info]
> Sau mỗi thay đổi endpoint, chạy `npm run generate:openapi` rồi commit `docs/openapi.json` cùng code để GitBook và Swagger luôn đồng bộ.
