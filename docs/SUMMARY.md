# Table of contents

* [Introduction](README.md)
* [Installation](installation.md)
* [Architecture](architecture.md)
* [OpenAPI and Swagger](openapi/README.md)
  * ```yaml
    type: builtin:openapi
    props:
      models: true
      downloadLink: true
    dependencies:
      spec:
        ref:
          kind: openapi
          spec: api-v1-0-1
    ```

## API reference (v1)

* [Authentication](api-v1/auth.md)
* [Users](api-v1/user.md)
* [Blogs](api-v1/blog.md)
* [Comments](api-v1/comment.md)
* [Likes](api-v1/likes.md)

## Data model

* [Schema](database/schema.md)
* [Entity relationship diagram](database/erd.md)

## Security and errors

* [Authentication and tokens](security/authentication.md)
* [Error codes and responses](security/error-codes.md)
