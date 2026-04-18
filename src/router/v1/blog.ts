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

/**
 * @openapi
 * /api/v1/blogs:
 *   post:
 *     tags: [Blogs]
 *     summary: Create blog (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               banner_image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image; processed via Cloudinary
 *               title: { type: string, maxLength: 180 }
 *               content: { type: string }
 *               status: { type: string, enum: [draft, published] }
 *     responses:
 *       201:
 *         description: Blog created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blog: { type: object, description: Created blog document }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not admin
 *       500:
 *         description: Server error
 */
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

/**
 * @openapi
 * /api/v1/blogs:
 *   get:
 *     tags: [Blogs]
 *     summary: List all blogs (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 50 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0 }
 *     responses:
 *       200:
 *         description: Paginated blogs
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not admin
 */
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

/**
 * @openapi
 * /api/v1/blogs/user/{userId}:
 *   get:
 *     tags: [Blogs]
 *     summary: List blogs by author user ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 50 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0 }
 *     responses:
 *       200:
 *         description: Paginated blogs for user
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not admin
 */
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

/**
 * @openapi
 * /api/v1/blogs/{slug}:
 *   get:
 *     tags: [Blogs]
 *     summary: Get blog by slug (admin or user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Blog detail
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (wrong role)
 *       404:
 *         description: Blog not found
 */
router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  param('slug').notEmpty().withMessage('Slug is required'),
  validationError,
  getBlogBySlug,
);

/**
 * @openapi
 * /api/v1/blogs/{blogId}:
 *   put:
 *     tags: [Blogs]
 *     summary: Update blog (admin only)
 *     description: Router requires **admin** role. `banner` and other fields are applied after upload middleware when provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               banner_image: { type: string, format: binary }
 *               title: { type: string, maxLength: 180 }
 *               content: { type: string }
 *               status: { type: string, enum: [draft, published] }
 *     responses:
 *       200:
 *         description: Updated blog
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blog: { type: object }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (e.g. insufficient permission in controller)
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
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

/**
 * @openapi
 * /api/v1/blogs/{blogId}:
 *   delete:
 *     tags: [Blogs]
 *     summary: Delete blog (admin only)
 *     description: Router requires **admin** role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted (no body)
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  param('blogId').notEmpty().withMessage('Invalid blog ID'),
  validationError,
  deleteABlog,
);
export default router;
