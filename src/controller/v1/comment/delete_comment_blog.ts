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
import Comment from 'src/model/comment';
import User from 'src/model/user';
import Blog from 'src/model/blog';

/**
 * Types
 */
import { Request, Response } from 'express';

const deleteCommentInBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const currentUserId = req.userId;
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId)
      .select('userId blogId')
      .lean()
      .exec();
    const user = await User.findById(currentUserId)
      .select('role')
      .lean()
      .exec();

    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
      });
      return;
    }

    if (comment.userId !== currentUserId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'Authorization',
        message: 'Access denied, insufficient permission',
      });
      return;
    }

    logger.warn('A user tried to delete a comment without permission', {
      userId: currentUserId,
      comment,
    });

    await Comment.deleteOne({ _id: commentId });

    logger.info('Comment delete successfully', {
      commentId,
    });

    const blog = await Blog.findById(comment.blogId)
      .select('commentsCount')
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    blog.commentsCount--;
    await blog.save();

    logger.info('Blog comments count update', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Invalid server error',
      error: error,
    });

    logger.error('Error during deleting comment in blog', error);
  }
};

export default deleteCommentInBlog;
