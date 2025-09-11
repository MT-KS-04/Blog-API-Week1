/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Custom Modules
 */
import { logger } from 'src/lib/winston';
import config from 'src/config';

/**
 * Models
 */

/**
 * Types
 */

import type { Request, Response } from 'express';

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: 'New user create',
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during user registration');
  }
};

export default register;
