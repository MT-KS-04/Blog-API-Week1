# 📝 Blogs (v1)

Base path: `/api/v1/blogs`

Most write operations require the **admin** role and a Bearer token. Reading by slug allows **admin** or **user**.

## 📡 Endpoints

| Method | Path | Role | Description |
|--------|------|------|-------------|
| 🔵 POST | `/` | **admin** | Create a blog — **multipart/form-data** |
| 🟢 GET | `/` | **admin** | List blogs; query `limit`, `offset` |
| 🟢 GET | `/user/:userId` | **admin** | Blogs by author; `limit`, `offset` |
| 🟢 GET | `/:slug` | **admin** or **user** | Blog detail by slug |
| 🟡 PUT | `/:blogId` | **admin** | Update — optional multipart for banner |
| 🔴 DELETE | `/:blogId` | **admin** | Delete blog |

## 📦 Multipart (create / update)

- Image field name: **`banner_image`** (matches Multer in the router).
- Text fields (per endpoint): `title`, `content`, `status` (`draft` \| `published`).
- After upload, middleware uploads to Cloudinary and attaches a `banner` object on the body for the controller.

## 🚦 Status codes

| Status | Meaning |
|--------|---------|
| 🟢 200 | Read / update success |
| 🟢 201 | Blog created |
| 🟢 204 | Delete success (no body) |
| 🟡 400 | Validation error (title too long, invalid status, missing banner, etc.) |
| 🟠 401 | Missing / invalid access token |
| 🟠 403 | Insufficient role |
| 🔎 404 | Blog not found |
| 🔴 500 | Server error |

{% hint style="info" %}
There is **no** public, unauthenticated blog read endpoint: `GET /:slug` still requires a JWT and the roles listed above.
{% endhint %}

## 🔗 Slug

If omitted, a slug is generated from `title` in a Mongoose pre-validate hook; slugs must be unique in the collection.

Details: [openapi.json](../openapi.json).
