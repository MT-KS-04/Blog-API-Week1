# Likes (v1)

Base path: `/api/v1/likes`

Requires Bearer authentication; roles `admin` or `user`.

## Endpoints

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/blog/:blogId` | JSON **`{ "userId": "<MongoId>" }`** | Like a blog; `200` with `likesCount`; `400` if already liked |
| DELETE | `/blog/:blogId` | JSON **`{ "userId": "<MongoId>" }`** | Unlike — **`204`** with no body on success |

> [!warning]
> The API **requires** `userId` in the JSON body by contract. Clients should send the authenticated user's id; the like handler does not substitute it from the JWT automatically.

The `Like` schema also has `commentId` (for future comment likes); v1 routes only operate on `blogId`.

Details: [openapi.json](../openapi.json).
