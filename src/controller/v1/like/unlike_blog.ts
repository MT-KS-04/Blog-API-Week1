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
import Like from 'src/model/like';

/**
 * Types
 */
import type { Request, Response } from 'express';

const unlikeBlog = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params;
  const { userId } = req.body;

  try {
    const existingLike = await Like.findOne({ userId, blogId }).lean().exec();

    if (!existingLike) {
      res.status(400).json({
        code: 'NotFound',
        message: 'Like not found',
      });
      return;
    }

    await Like.deleteOne({ _id: existingLike._id });

    const blog = await Blog.findById(blogId).select('likesCount').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    blog.likesCount--;
    await blog.save();

    logger.info('Blog unlike successfully', {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Invalid server error',
      error: error,
    });

    logger.error('Error when unlike blog', error);
  }
};

export default unlikeBlog;
