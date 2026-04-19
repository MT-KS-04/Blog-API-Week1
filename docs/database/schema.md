# Mô tả schema (Mongoose)

Persistence dùng **MongoDB** qua **Mongoose**. Không dùng Prisma/SQL.

## User (`User`)

| Field | Kiểu / ghi chú |
|-------|------------------|
| `username` | String, required, unique, max 20 |
| `email` | String, required, unique, max 50 |
| `password` | String, required, `select: false`, hash bcrypt khi `save` |
| `role` | `admin` \| `user`, default `user` |
| `firstName`, `lastName` | String, optional, max 20 |
| `socialLink.*` | `website`, `facebook`, `instagram`, `linkedin`, `x`, `youtube` — optional, max 100 |
| timestamps | `createdAt`, `updatedAt` |

## Blog (`Blog`)

| Field | Kiểu / ghi chú |
|-------|------------------|
| `title` | String, required, max 180 |
| `slug` | String, required, unique; auto từ `title` nếu trống (pre-validate) |
| `content` | String, required |
| `banner` | `{ publicId, url, width, height }` — required ở schema |
| `author` | ObjectId ref `User` |
| `viewCount`, `likesCount`, `commentsCount` | Number, default 0 |
| `status` | `draft` \| `published`, default `draft` |
| timestamps | `publishedAt` (map `createdAt`), `updatedAt` |

## Comment (`Comment`)

| Field | Kiểu / ghi chú |
|-------|------------------|
| `blogId` | ObjectId, required (không khai báo `ref` trong schema) |
| `userId` | ObjectId ref `User`, required |
| `content` | String, required, max 1000 |

## Like (`Like`)

| Field | Kiểu / ghi chú |
|-------|------------------|
| `blogId` | ObjectId, optional trên schema |
| `commentId` | ObjectId, optional (route v1 hiện chỉ dùng like blog) |
| `userId` | ObjectId ref `User`, required |

## Token (`Token`)

| Field | Kiểu / ghi chú |
|-------|------------------|
| `token` | String, required — refresh JWT lưu server-side |
| `userId` | ObjectId, required |

Nguồn: thư mục `src/model/` trong repo.
