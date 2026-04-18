/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 *
 * Build-time OpenAPI generation. Reads JSDoc @openapi from src/router/v1/*.ts
 * (source comments are stripped from dist; Docker image has no src/).
 */

const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const root = path.join(__dirname, '..');
/** Single source for Swagger UI + GitBook / tooling (see docs/). */
const outFile = path.join(root, 'docs', 'openapi.json');

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'Blog API',
    version: '1.0.0',
    description:
      'REST API for the Blog backend (Express 5, MongoDB/Mongoose, JWT). All JSON routes are under `/api/v1`.',
    license: { name: 'Apache-2.0' },
  },
  servers: [{ url: '/' }],
  tags: [
    { name: 'Health', description: 'Liveness and metadata' },
    { name: 'Auth', description: 'Register, login, refresh token, logout' },
    { name: 'Users', description: 'Current user and admin user management' },
    { name: 'Blogs', description: 'Blog CRUD (admin write; slug read for admin/user)' },
    { name: 'Comments', description: 'Comments on blogs (mount path is `/comment`)' },
    { name: 'Likes', description: 'Like/unlike blogs' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token from login/register response.',
      },
      cookieRefreshToken: {
        type: 'apiKey',
        in: 'cookie',
        name: 'refreshToken',
        description: 'HTTP-only JWT refresh cookie set on login/register.',
      },
    },
    schemas: {
      ValidationError: {
        type: 'object',
        properties: {
          code: { type: 'string', example: 'ValidationError' },
          errors: {
            type: 'object',
            additionalProperties: true,
            description: 'express-validator mapped errors',
          },
        },
      },
      ErrorBody: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
};

const spec = swaggerJsdoc({
  definition,
  apis: [path.join(root, 'src', 'router', 'v1', '*.ts')],
});

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(spec, null, 2), 'utf8');
console.log(`OpenAPI spec written to ${path.relative(root, outFile)}`);
