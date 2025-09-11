/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: ['https://www.youtube.com'],
  MONGOOSE_URL: process.env.MONGOOSE_URL,
  LOG_LEVELS: process.env.LOG_LEVELS,
};

export default config;
