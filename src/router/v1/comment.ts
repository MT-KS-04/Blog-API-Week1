/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { Router } from 'express';
import { body, param, query } from 'express-validator';

/**
 * Middlewares
 */
import authenticate from 'src/middleware/authenticate';
import authorize from 'src/middleware/authorize';
import validationError from 'src/middleware/validationError';

/**
 * Controllers
 */
import commentBlog from 'src/controller/v1/comment/comment_blog';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').notEmpty().withMessage('Invalid blog ID'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validationError,
  commentBlog,
);

export default router;
