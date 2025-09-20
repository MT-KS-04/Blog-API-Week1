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

const likeBlogs = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params;
  const { userId } = req.body;

  try {
    const blog = await Blog.findById(blogId).select('likesCount').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'BLog not found',
      });
      return;
    }

    const existingLike = await Like.findOne({ blogId, userId }).lean().exec();
    if (existingLike) {
      res.status(400).json({
        code: 'BadRequest',
        message: 'You already like this blog',
      });
      return;
    }

    await Like.create({ blogId, userId });

    blog.likesCount++;
    await blog.save();

    logger.info('Blog liked successfully', {
      userId,
      blogId: blog._id,
      likeCount: blog.likesCount,
    });

    res.status(200).json({
      likesCount: blog.likesCount,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Invalid server error',
      error: error,
    });

    logger.error('Error while liking blogs', error);
  }
};

export default likeBlogs;
