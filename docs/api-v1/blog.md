# Bài viết — Blog (v1)

Base path: `/api/v1/blogs`

Hầu hết thao tác ghi cần role **admin** và header Bearer. Đọc theo slug cho phép **admin** hoặc **user**.

## Endpoints

| Method | Path | Role | Mô tả |
|--------|------|------|--------|
| POST | `/` | **admin** | Tạo blog — **multipart/form-data** |
| GET | `/` | **admin** | Danh sách blog; query `limit`, `offset` |
| GET | `/user/:userId` | **admin** | Blog của một author; `limit`, `offset` |
| GET | `/:slug` | **admin** hoặc **user** | Chi tiết blog theo slug |
| PUT | `/:blogId` | **admin** | Cập nhật — multipart tùy chọn cho banner |
| DELETE | `/:blogId` | **admin** | Xóa blog (204) |

## Multipart (tạo / sửa)

- Field file ảnh: **`banner_image`** (tên field khớp Multer trong router).
- Các field text (tùy endpoint): `title`, `content`, `status` (`draft` \| `published`).
- Sau upload, middleware xử lý Cloudinary và gán object `banner` vào body cho controller.

> [!info]
> API **không** có endpoint đọc blog công khai không đăng nhập: `GET /:slug` vẫn cần JWT và role như bảng trên.

## Slug

Slug được sinh từ `title` trong pre-validate Mongoose nếu chưa có; phải unique trong collection.

Chi tiết: [openapi.json](../openapi.json).
