# Bình luận (v1)

Base path: **`/api/v1/comment`** (số ít **`comment`**, không phải `comments`).

Cần Bearer; role `admin` hoặc `user`.

## Endpoints

| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/blog/:blogId` | JSON `{ "content": "..." }` — tạo comment; 201 kèm `comment` và `commentsCount` |
| GET | `/blog/:blogId` | Danh sách comment của blog; body response dùng key **`comment`** (mảng) |
| DELETE | `/blog/:commentId` | Xóa comment theo **ID comment** (param là `commentId`, không phải `blogId`) — 204 khi thành công |

## Quyền xóa

Controller cho phép xóa nếu là chủ comment hoặc **admin**.

Chi tiết: [openapi.json](../openapi.json).
