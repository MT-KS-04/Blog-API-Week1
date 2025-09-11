/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import mongoose from 'mongoose';
/**
 * Custom Modules
 */
import config from 'src/config';
import { logger } from './winston';
/**
 * Types
 */
import type { ConnectOptions } from 'mongoose';

/**
 * Client Options
 */
const clientOptions: ConnectOptions = {
  dbName: 'blog-api',
  appName: 'Blog Api Basic',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

const connectToData = async (): Promise<void> => {
  if (!config.MONGOOSE_URL) {
    throw new Error('MONGOOSE_URL is not set in environment variables');
  }

  try {
    await mongoose.connect(config.MONGOOSE_URL, clientOptions);
    logger.info('✅ Connected to MongoDB successfully.', {
      url: config.MONGOOSE_URL,
      option: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Failed to connect to MongoDB:', err.message);
      throw err;
    }
    logger.error('❌ Failed to connect to MongoDB:', err);
  }
};

const disconnectFromData = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('✅ Disconnect the database successfully', {
      url: config.MONGOOSE_URL,
      option: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    logger.error('⚠️ Error disconnect from the database.', err);
  }
};

export { connectToData, disconnectFromData };
