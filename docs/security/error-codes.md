# Mã lỗi và định dạng response

## Validation (express-validator)

Khi validator chain báo lỗi trước controller:

- **HTTP 400**
- Body:

```json
{
  "code": "ValidationError",
  "errors": { }
}
```

`errors` là object dạng `express-validator` `mapped()` (theo field).

## Lỗi xác thực (JWT access)

Middleware `authenticate` thường trả **401** với:

- `code: AuthenticationError`
- `message` mô tả (thiếu token, hết hạn, không hợp lệ, …)

## Mã `code` thường gặp trong controller

| HTTP | `code` (ví dụ) | Ngữ cảnh gợi ý |
|------|----------------|-----------------|
| 400 | `ValidationError` | Validator |
| 400 | `BadRequest` | Ví dụ đã like blog |
| 401 | `AuthenticationError` | Refresh không hợp lệ / hết hạn |
| 403 | `AuthorizationError` | Không đủ quyền (vd đăng ký admin, blog) |
| 403 | `Authorization` | Một số chỗ comment delete (tên code trong code) |
| 404 | `NotFound` | User, blog, comment, like, … |
| 500 | `ServerError` | Lỗi không mong đợi |

Một số response có thêm field `message` và/hoặc `error` (chi tiết lỗi) tùy endpoint.

> [!info]
> **Rate limit:** vượt ngưỡng toàn cục có thể nhận **429** với message text từ `express-rate-limit` (không cùng schema JSON với `ValidationError`).

## Thành công không body

Một số thao tác trả **204 No Content** (không JSON): ví dụ logout thành công, xóa user, xóa blog, xóa comment, unlike blog — xem từng endpoint trong OpenAPI / Swagger.
