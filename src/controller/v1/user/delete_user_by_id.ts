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

/**
 * Types
 */
import type { Request, Response } from 'express';

const deleteUserByID = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;

  try {
    const user = await User.deleteOne({ _id: userId });

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    logger.info('A current account user has been deleted', { userId });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Invalid server error',
      error: error,
    });

    logger.error('Error while deleting current user by ID', error);
  }
};

export default deleteUserByID;
