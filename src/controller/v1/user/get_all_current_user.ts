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
import User from 'src/model/user';

/**
 * Types
 */
import type { Request, Response } from 'express';

const getAllCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    //Use limit and offset for basic paging of data
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;
    const total = await User.countDocuments();

    const user = await User.find({ role: 'user' })
      .select('-__v')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      user,
    });

    logger.info(
      `Get all current users successfully was performed by ${userId}`,
    );
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Invalid server error',
      error: error,
    });

    logger.error('Error while getting all current users', error);
  }
};

export default getAllCurrentUser;
