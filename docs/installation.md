# Cài đặt dự án

## Yêu cầu

- **Node.js** 22 (khớp Dockerfile) hoặc LTS tương thích
- **MongoDB** (Atlas hoặc bản cài local) — URI kết nối qua biến môi trường

## Cài dependency

```bash
npm install
```

## Biến môi trường

Tạo file `.env` ở thư mục gốc project (không commit file thật). Tham chiếu tên biến từ `.env.example` trong repo:

| Biến | Mô tả |
|------|--------|
| `PORT` | Cổng HTTP (mặc định code có thể dùng 3000) |
| `NODE_ENV` | `development` \| `production` \| `test` |
| `MONGOOSE_URL` | Chuỗi kết nối MongoDB (**không** dùng tên `MONGO_URI` nếu không khớp code) |
| `LOG_LEVELS` | Mức log Winston (vd: `info`) |
| `JWT_ACCESS_SECRET` | Secret ký JWT access |
| `JWT_REFRESH_SECRET` | Secret ký JWT refresh |
| `ACCESS_TOKEN_EXPIRY` | Thời hạn access (chuỗi kiểu `ms`, vd `15m`) |
| `REFRESH_TOKEN_EXPIRY` | Thời hạn refresh |
| `CLOUDINARY_CLOUD_NAME` | Tên cloud Cloudinary |
| `CLOUDINARY_API_KEY` | API key |
| `CLOUDINARY_API_SECRET` | API secret |

> [!warning]
> Không dán secret thật vào tài liệu công khai hoặc GitBook — chỉ mô tả tên biến.

**CORS:** danh sách origin cho phép đang cấu hình trong mã nguồn (`config.WHITELIST_ORIGINS`). Khi deploy domain mới, cần chỉnh code hoặc refactor sang env.

## OpenAPI cho Swagger UI

Server đọc spec tại `docs/openapi.json`. Trước lần chạy đầu hoặc sau khi sửa JSDoc `@openapi` trên router:

```bash
npm run generate:openapi
```

Hoặc chạy full build (đã gọi generate):

```bash
npm run build
```

## Chạy ứng dụng

- **Development (nodemon + ts-node):** `npm start`  
  (Project **không** định nghĩa script `npm run dev`; dùng `npm start`.)

- **Production (sau `npm run build`):** `npm run start:prod`  
  Chạy `node dist/server.js` — cần MongoDB và `.env` hợp lệ.

## Docker

Build image trong repo đã có `Dockerfile`: stage build chạy `npm run build` (gồm generate OpenAPI), image chạy copy `dist/` và `docs/` (để `/api-docs` đọc được `openapi.json`).

```bash
docker compose up --build
```

(Điều chỉnh lệnh nếu bạn dùng `docker build` trực tiếp.)

## Kiểm tra nhanh

1. `GET http://localhost:<PORT>/api/v1/` — 200 nếu server và DB đã kết nối.
2. `GET http://localhost:<PORT>/api-docs` — giao diện Swagger.
