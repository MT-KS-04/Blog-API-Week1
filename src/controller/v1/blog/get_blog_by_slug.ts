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
import Blog from 'src/model/blog';
import User from 'src/model/user';
/**
 * Types
 */
import type { Request, Response } from 'express';

const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const slug = req.params.slug;

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findOne({ slug })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .lean()
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (user?.role === 'user' && blog.status === 'draft') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });

      logger.warn('A user tried to access a draft blog', {
        userId,
        blog,
      });

      return;
    }

    res.status(200).json({
      blog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Invalid server error',
      error: error,
    });

    logger.error('Error during getting blogs by slug', error);
  }
};

export default getBlogBySlug;
