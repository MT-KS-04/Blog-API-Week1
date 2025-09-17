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
import Blog from 'src/model/blog';
import User from 'src/model/user';
/**
 * Types
 */
import type { Request, Response } from 'express';

interface QueryType {
  status?: 'draft' | 'published';
}

const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const limit = parseInt(req.params.limit as string) | config.defaultResLimit;
    const offset =
      parseInt(req.params.offset as string) | config.defaultResOffset;

    const user = await User.findById(userId).select('role').lean().exec();
    const query: QueryType = {};

    // Show only the published post to a normal user
    if (user?.role === 'user') {
      query.status = 'published';
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
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

    logger.error('Error during getting all blogs', error);
  }
};

export default getAllBlogs;
