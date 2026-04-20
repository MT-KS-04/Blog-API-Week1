/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

import dotenv from 'dotenv';

/**
 * Types
 */
import ms from 'ms';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: [
    'https://mk-ts-04.site',
    'https://blog-api.mk-ts-04.site',
    'https://docs.blog-api.mk-ts-04.site',
  ],
  MONGOOSE_URL: process.env.MONGOOSE_URL,
  LOG_LEVELS: process.env.LOG_LEVELS,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMIN_EMAIL: [
    'ktomis2004@gmail.com',
    'ktomisAdmin@gmail.com',
    'admin@gmail.com',
  ],
  defaultResLimit: 20,
  defaultResOffset: 0,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  /** Amazon DocumentDB: set USE_DOCUMENTDB=true (string "true" only). */
  useDocumentDb: process.env.USE_DOCUMENTDB === 'true',
  /** CA bundle path inside container (e.g. compose mount). */
  docdbTlsCaFile:
    process.env.DOCDB_TLS_CA_FILE?.trim() || '/app/global-bundle.pem',
  /**
   * DocumentDB: default true unless DOCDB_DIRECT_CONNECTION=false.
   * Ignored when useDocumentDb is false.
   */
  docdbDirectConnection: process.env.DOCDB_DIRECT_CONNECTION !== 'false',
};

export default config;
