# OpenAPI and Swagger

This project keeps the OpenAPI contract in [`openapi.json`](../openapi.json) and serves interactive Swagger UI from the backend.

## 🌐 Production

- Swagger UI: [https://mk-ts-04.site/api-docs](https://mk-ts-04.site/api-docs)
- Raw OpenAPI JSON: [openapi.json](../openapi.json)

## 💻 Local (optional)

- Swagger UI: `http://localhost:3000/api-docs`

## 🔄 Regenerate the spec

Run this after endpoint or schema changes in router `@openapi` blocks:

```bash
npm run generate:openapi
```

Or run a full build (it regenerates OpenAPI first):

```bash
npm run build
```

{% hint style="warning" %}
Keep `docs/openapi.json` committed and synchronized with every API contract change.
{% endhint %}
