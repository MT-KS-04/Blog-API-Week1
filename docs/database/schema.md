# 🗄️ Schema (Mongoose)

Data is stored in **MongoDB** via **Mongoose**. This project does not use Prisma or SQL.

## 👤 User (`User`)

| Field | Type / notes |
|-------|----------------|
| `username` | String, required, unique, max 20 |
| `email` | String, required, unique, max 50 |
| `password` | String, required, `select: false`, bcrypt-hashed on `save` |
| `role` | `admin` \| `user`, default `user` |
| `firstName`, `lastName` | String, optional, max 20 |
| `socialLink.*` | `website`, `facebook`, `instagram`, `linkedin`, `x`, `youtube` — optional, max 100 |
| timestamps | `createdAt`, `updatedAt` |

## 📝 Blog (`Blog`)

| Field | Type / notes |
|-------|----------------|
| `title` | String, required, max 180 |
| `slug` | String, required, unique; auto from `title` if empty (pre-validate) |
| `content` | String, required |
| `banner` | `{ publicId, url, width, height }` — required in schema |
| `author` | ObjectId ref `User` |
| `viewCount`, `likesCount`, `commentsCount` | Number, default 0 |
| `status` | `draft` \| `published`, default `draft` |
| timestamps | `publishedAt` (maps `createdAt`), `updatedAt` |

## 💬 Comment (`Comment`)

| Field | Type / notes |
|-------|----------------|
| `blogId` | ObjectId, required (no `ref` in schema) |
| `userId` | ObjectId ref `User`, required |
| `content` | String, required, max 1000 |

## ❤️ Like (`Like`)

| Field | Type / notes |
|-------|----------------|
| `blogId` | ObjectId, optional in schema |
| `commentId` | ObjectId, optional (v1 routes only use blog likes) |
| `userId` | ObjectId ref `User`, required |

## 🔑 Token (`Token`)

| Field | Type / notes |
|-------|----------------|
| `token` | String, required — refresh JWT stored server-side |
| `userId` | ObjectId, required |

Source: `src/model/` in the repository.
