/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * Custom Modules
 */

import config from 'src/config';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

// Define the transports array to hold different logging transports
const transports: winston.transport[] = [];

// If the application is not running in production, add a console transport
if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // Add color to log levels
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), // Add timestamp to log
        align(), // Align log message
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : '';
          return `${timestamp} [${level}: ${message}${metaStr}`;
        }),
      ),
    }),
  );
}

// Daily log files (YYYY-MM-DD in filename); rotate early if a file reaches 20MB; drop files older than 14 days
if (config.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  );
}

// Create a logger instance using winston
const logger = winston.createLogger({
  level: config.LOG_LEVELS || 'info', // Set the default logging level to 'info'
  format: combine(timestamp(), errors({ stack: true }), json()), // Use JSON format for log message
  transports,
  silent: config.NODE_ENV === 'test', // Disable logging in test environment
});

export { logger };
