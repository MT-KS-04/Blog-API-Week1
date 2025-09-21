/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

/**
 * Custom Modules
 */
import { logger } from 'src/lib/winston';

/**
 * Models
 */
import Blog from 'src/model/blog';
import Comment from 'src/model/comment';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IComment } from 'src/model/comment';

type CommentData = Pick<IComment, 'content'>;

/**
 * Purify the comment content
 */
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const commentBlog = async (req: Request, res: Response): Promise<void> => {
  const { content } = req.body as CommentData;
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const cleanContent = purify.sanitize(content);

    const newComment = await Comment.create({
      blogId: blogId,
      userId: userId,
      content: cleanContent,
    });

    logger.info('New comment create', newComment);

    blog.commentsCount++;
    await blog.save();

    logger.info('Blog comment count update', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });
    res.status(201).json({
      comment: newComment,
      commentsCount: blog.commentsCount,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Invalid server error ',
      error: error,
    });

    logger.error('Error during commenting in blog', error);
  }
};

export default commentBlog;
