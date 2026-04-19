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

const baseConnectOptions = {
  dbName: 'blog-api',
  appName: 'Blog Api Basic',
} as const;

const atlasConnectOptions: ConnectOptions = {
  ...baseConnectOptions,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

/**
 * Amazon DocumentDB does not support MongoDB Stable API (`serverApi`).
 * Use TLS + CA file and driver flags compatible with DocumentDB.
 */
const getDocumentDbConnectOptions = (): ConnectOptions => ({
  ...baseConnectOptions,
  tls: true,
  tlsCAFile: config.docdbTlsCaFile,
  retryWrites: false,
  directConnection: config.docdbDirectConnection,
});

const getMongoConnectOptions = (): ConnectOptions =>
  config.useDocumentDb ? getDocumentDbConnectOptions() : atlasConnectOptions;

const connectToData = async (): Promise<void> => {
  if (!config.MONGOOSE_URL) {
    throw new Error('MONGOOSE_URL is not set in environment variables');
  }

  const connectOptions = getMongoConnectOptions();

  try {
    await mongoose.connect(config.MONGOOSE_URL, connectOptions);
    logger.info('✅ Connected to MongoDB successfully.', {
      url: config.MONGOOSE_URL,
      useDocumentDb: config.useDocumentDb,
      option: connectOptions,
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
      useDocumentDb: config.useDocumentDb,
      option: getMongoConnectOptions(),
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    logger.error('⚠️ Error disconnect from the database.', err);
  }
};

export { connectToData, disconnectFromData };
