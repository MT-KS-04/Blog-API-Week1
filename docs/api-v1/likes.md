# Lượt thích — Likes (v1)

Base path: `/api/v1/likes`

Cần Bearer; role `admin` hoặc `user`.

## Endpoints

| Method | Path | Body | Mô tả |
|--------|------|------|--------|
| POST | `/blog/:blogId` | JSON **`{ "userId": "<MongoId>" }`** | Like blog; 200 với `likesCount`; 400 nếu đã like |
| DELETE | `/blog/:blogId` | JSON **`{ "userId": "<MongoId>" }`** | Unlike — **204** không body khi thành công |

> [!warning]
> API **bắt buộc** `userId` trong body theo contract hiện tại. Client nên gửi đúng user đang đăng nhập; server không thay thế tự động từ JWT trong handler like.

Schema `Like` trong DB còn có field `commentId` (dùng cho like comment trong tương lai); các route v1 hiện tại chỉ thao tác theo `blogId`.

Chi tiết: [openapi.json](../openapi.json).
