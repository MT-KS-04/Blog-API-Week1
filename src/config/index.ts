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
  WHITELIST_ORIGINS: ['https://www.youtube.com'],
  MONGOOSE_URL: process.env.MONGOOSE_URL,
  LOG_LEVELS: process.env.LOG_LEVELS,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMIN_EMAIL: ['ktomis2004@gmail.com', 'ktomisAdmin@gmail.com'],
  defaultResLimit: 20,
  defaultResOffset: 0,
};

export default config;
