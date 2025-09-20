/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { Router } from 'express';
import { param, body, query } from 'express-validator';
import multer from 'multer';
/**
 * Middlewares
 */
import validationError from 'src/middleware/validationError';
import authorize from 'src/middleware/authorize';
import authenticate from 'src/middleware/authenticate';
import uploadBlogBanner from 'src/middleware/uploadBlogBanner';
/**
 * Controllers
 */
import createBlog from 'src/controller/v1/blog/create_blog';
import getAllBlogs from 'src/controller/v1/blog/get_all_blogs';
import getBlogByUser from 'src/controller/v1/blog/get_blog_by_user';
import getBlogBySlug from 'src/controller/v1/blog/get_blog_by_slug';
import updateBlog from 'src/controller/v1/blog/update_blog';
import deleteABlog from 'src/controller/v1/blog/delete_a_blog';

const upload = multer();

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the values, draft or published'),
  validationError,
  uploadBlogBanner('post'),
  createBlog,
);

router.get(
  '/',
  authenticate,
  authorize(['admin']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must be a positive integer '),
  validationError,
  getAllBlogs,
);

router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').isMongoId().withMessage('Invalid user ID'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must be a positive integer '),
  validationError,
  getBlogByUser,
);

router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  param('slug').notEmpty().withMessage('Slug is required'),
  validationError,
  getBlogBySlug,
);

router.put(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  param('blogId').notEmpty().withMessage('Invalid blog ID'),
  upload.single('banner_image'),
  body('title')
    .optional()
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the values, draft or published'),
  validationError,
  uploadBlogBanner('put'),
  updateBlog,
);

router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  param('blogId').notEmpty().withMessage('Invalid blog ID'),
  validationError,
  deleteABlog,
);
export default router;
