/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom Modules
 */
import config from './config';
import limiter from './lib/express_rate_limit';
import { connectToData, disconnectFromData } from './lib/mongoose';
import { logger } from './lib/winston';
/**
 * Router
 */
import v1Router from './router/v1';
import { setupSwagger } from './swagger/setupSwagger';

/**
 * Types
 */
import { CorsOptions } from 'cors';

/**
 * Express app initial
 */
const app = express();

/**
 * Configure CORS Options
 */

const CorsOption: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by CORS`),
        false,
      );

      logger.warn(`CORS Error: ${origin} is not allowed by CORS`);
    }
  },
};

app.use(cors(CorsOption));

/**
 * Enable JSON request body parsing
 */
app.use(express.json());

// Enable URL-encoded request body parsing with extended mode
// `extended: true' allows rich objects and arrays via querystring
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // Only compress response larger than 1KB
  }),
);

// Swagger UI (before helmet so CSP does not block swagger-ui-assets / inline scripts)
setupSwagger(app);

// Use helmet to enhance security by setting various HTTP header
app.use(helmet());

// Apply rate limiting middleware to prevent request and enhance security
app.use(limiter);

/**
 * Immediately Invoked Async Function Expression (IIFE) to start the server.
 * - Tries to connect to the database before initializing the server.
 * - Defines the API route (`/api/v1`).
 * - Starts the server on the specified PORT and logs the running URL.
 * - If an error occurs during startup, it is logged, and the process exits with status 1.
 */

(async () => {
  try {
    await connectToData();
    app.use('/api/v1/', v1Router);

    app.listen(config.PORT, () => {
      logger.info('✅ Server is running ....');
      logger.info(`✅ Link-Api: http://localhost:${config.PORT}/`);
    });
  } catch (error) {
    logger.error('❌ Failed to start the Server', error);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

/**
 * Handles server shutdown gracefully by disconnecting from the database.
 * - Attempts to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection, it is logged to the console.
 * - Exits the process with status code `0` (indicating a successful shutdown).
 */

const handelServerShutdown = async () => {
  try {
    await disconnectFromData();
    logger.info('【⏻】Shutting down server...');
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown', error);
  }
};

/**
 * Listens for termination signals (`SIGTERM` and `SIGINT`).
 *
 * - `SIGTERM is typically sent when stopping a process (e.g., `kill` command or container shutdown).
 * - `SIGINT` is triggered when the user interrupts the process (e.g., pressing 'Ctrl + C`).
 * - When either signal is received, handleServerShutdown' is executed to ensure proper cleanup.
 */

process.on('SIGTERM', handelServerShutdown);
process.on('SIGINT', handelServerShutdown);
