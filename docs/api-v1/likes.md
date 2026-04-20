# Likes

Base path: `/api/v1/likes`

Requires Bearer authentication; roles `admin` or `user`.

## 📡 Endpoints

| Method    | Path            | Body                                 | Description                       |
| --------- | --------------- | ------------------------------------ | --------------------------------- |
| 🔵 POST   | `/blog/:blogId` | JSON **`{ "userId": "<MongoId>" }`** | Like a blog; returns `likesCount` |
| 🔴 DELETE | `/blog/:blogId` | JSON **`{ "userId": "<MongoId>" }`** | Unlike — no body on success       |

## 🚦 Status codes

| Status | Meaning                                                                 |
| ------ | ----------------------------------------------------------------------- |
| 🟢 200 | Like success                                                            |
| 🟢 204 | Unlike success (no body)                                                |
| 🟡 400 | Validation error (missing `userId`, invalid ObjectId, or already liked) |
| 🟠 401 | Missing / invalid access token                                          |
| 🟠 403 | Insufficient role                                                       |
| 🔎 404 | Blog / like record not found                                            |
| 🔴 500 | Server error                                                            |

{% hint style="warning" %}
The API **requires** `userId` in the JSON body by contract. Clients should send the authenticated user's id; the like handler does not substitute it from the JWT automatically.
{% endhint %}

The `Like` schema also has `commentId` (for future comment likes); v1 routes only operate on `blogId`.

Details: [openapi.json](../openapi.json).
