/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
/**
 * Middlewares
 */
import authenticate from 'src/middleware/authenticate';
import authorize from 'src/middleware/authorize';
import validationError from 'src/middleware/validationError';

/**
 * Controllers
 */
import likeBlogs from 'src/controller/v1/like/like_blog';
import unlikeBlog from 'src/controller/v1/like/unlike_blog';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  validationError,
  likeBlogs,
);

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  validationError,
  unlikeBlog,
);

export default router;
