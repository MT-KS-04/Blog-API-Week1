/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Custom Modules
 */
import { logger } from 'src/lib/winston';

/**
 * Models
 */
import User from 'src/model/user';

import type { Request, Response } from 'express';
import user from 'src/model/user';

const deleteCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    await User.deleteOne({ _id: userId });

    logger.info('A user account has been deleted', { userId });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error while deleting current user account', error);
  }
};

export default deleteCurrentUser;
