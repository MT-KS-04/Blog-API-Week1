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
import User from 'src/model/user';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IBlog } from 'src/model/blog';

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

/**
 * Purify the blog content
 */
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, banner, status } = req.body as BlogData;

    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).select('-__v').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (blog.author !== userId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });

      logger.warn('A user tried to update a blog without permissions', {
        userId,
        blog,
      });

      return;
    }

    if (title) blog.title = title;
    if (content) {
      const clearContent = purify.sanitize(content);
      blog.content = clearContent;
    }

    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await blog.save();

    logger.info('Blog Update', { blog });

    res.status(200).json({
      blog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Invalid server error',
      error: error,
    });

    logger.error('Error while updating blog', error);
  }
};

export default updateBlog;
