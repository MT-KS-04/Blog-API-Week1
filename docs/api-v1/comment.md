# Comments (v1)

Base path: **`/api/v1/comment`** (singular **`comment`**, not `comments`).

Requires Bearer authentication; roles `admin` or `user`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/blog/:blogId` | JSON `{ "content": "..." }` — create comment; `201` with `comment` and `commentsCount` |
| GET | `/blog/:blogId` | List comments for a blog; response body uses the **`comment`** key (array) |
| DELETE | `/blog/:commentId` | Delete a comment by **comment id** (param is `commentId`, not `blogId`) — `204` on success |

## Delete permissions

The controller allows deletion by the comment author or an **admin**.

Details: [openapi.json](../openapi.json).
