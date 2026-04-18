/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

/**
 * Path to generated spec: repo `docs/openapi.json` (same file for GitBook references).
 * Resolved from `src/swagger` or `dist/swagger` via `../..`.
 */
function resolveOpenApiPath(): string {
  return path.join(__dirname, '..', '..', 'docs', 'openapi.json');
}

/**
 * Serves Swagger UI at `/api-docs`. Run `npm run generate:openapi` (or `npm run build`) to create `docs/openapi.json`.
 */
export function setupSwagger(app: Express): void {
  const specPath = resolveOpenApiPath();
  const raw = fs.readFileSync(specPath, 'utf8');
  const openApiSpec = JSON.parse(raw) as Parameters<typeof swaggerUi.setup>[0];

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customSiteTitle: 'Blog API',
    }),
  );
}
