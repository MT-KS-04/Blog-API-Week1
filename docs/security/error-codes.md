# Error codes and response shape

## Validation (express-validator)

When the validator chain fails before the controller:

- **HTTP 400**
- Body:

```json
{
  "code": "ValidationError",
  "errors": { }
}
```

`errors` follows express-validator's `mapped()` shape (per field).

## Authentication (access JWT)

The `authenticate` middleware typically returns **401** with:

- `code: AuthenticationError`
- `message` describing the failure (missing token, expired, invalid, etc.)

## Common `code` values from controllers

| HTTP | `code` (examples) | Typical context |
|------|-------------------|-----------------|
| 400 | `ValidationError` | Validator failure |
| 400 | `BadRequest` | e.g. already liked the blog |
| 401 | `AuthenticationError` | Invalid or expired refresh |
| 403 | `AuthorizationError` | Insufficient permission (e.g. admin registration, blog) |
| 403 | `Authorization` | Some comment-delete paths (as named in code) |
| 404 | `NotFound` | User, blog, comment, like, etc. |
| 500 | `ServerError` | Unexpected server error |

Some responses also include `message` and/or `error` depending on the endpoint.

> [!info]
> **Rate limiting:** exceeding the global limit may return **429** with a plain-text message from `express-rate-limit` (not the same JSON shape as `ValidationError`).

## Success with no body

Some operations return **204 No Content** (no JSON), for example successful logout, user delete, blog delete, comment delete, and unlike — see each operation in OpenAPI / Swagger.
