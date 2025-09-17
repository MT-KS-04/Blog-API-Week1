/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Custom Modules
 */
import config from 'src/config';
import { logger } from 'src/lib/winston';

/**
 * Models
 */
import User from 'src/model/user';
import Blog from 'src/model/blog';
/**
 * Types
 */
import type { Request, Response } from 'express';
export interface QueryType {
  status?: 'draft' | 'published';
}

const getBlogByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.userId;

    const limit = parseInt(req.params.limit as string) | config.defaultResLimit;
    const offset =
      parseInt(req.params.offset as string) | config.defaultResOffset;

    const currentUser = await User.findById(currentUserId)
      .select('role')
      .lean()
      .exec();
    const query: QueryType = {};

    // Show only the published post to a normal user
    if (currentUser?.role === 'user') {
      query.status = 'published';
    }

    const total = await Blog.countDocuments({ author: userId, ...query });
    const blogs = await Blog.find({ author: userId, ...query })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .limit(limit)
      .skip(offset)
      .sort({ createAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      blogs,
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

    logger.error('Error during getting blogs by user', error);
  }
};

export default getBlogByUser;
