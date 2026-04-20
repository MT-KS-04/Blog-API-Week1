# 💬 Comments (v1)

Base path: **`/api/v1/comment`** (singular **`comment`**, not `comments`).

Requires Bearer authentication; roles `admin` or `user`.

## 📡 Endpoints

| Method | Path | Description |
|--------|------|-------------|
| 🔵 POST | `/blog/:blogId` | JSON `{ "content": "..." }` — create comment; returns `comment` and `commentsCount` |
| 🟢 GET | `/blog/:blogId` | List comments for a blog; response body uses the **`comment`** key (array) |
| 🔴 DELETE | `/blog/:commentId` | Delete a comment by **comment id** (param is `commentId`, not `blogId`) |

## 🚦 Status codes

| Status | Meaning |
|--------|---------|
| 🟢 200 | List comments success |
| 🟢 201 | Comment created |
| 🟢 204 | Delete success (no body) |
| 🟡 400 | Validation error (empty or too-long content, etc.) |
| 🟠 401 | Missing / invalid access token |
| 🟠 403 | Not the author and not admin |
| 🔎 404 | Blog / comment not found |
| 🔴 500 | Server error |

## 🛂 Delete permissions

The controller allows deletion by the comment author or an **admin**.

Details: [openapi.json](../openapi.json).
