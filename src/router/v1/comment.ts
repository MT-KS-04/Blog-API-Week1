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
import getCommentsByBlog from 'src/controller/v1/comment/get_comment_by_blog';
import deleteCommentInBlog from 'src/controller/v1/comment/delete_comment_blog';

const router = Router();

/**
 * @openapi
 * /api/v1/comment/blog/{blogId}:
 *   post:
 *     tags: [Comments]
 *     summary: Add comment on blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: Comment created; blog `commentsCount` incremented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment: { type: object }
 *                 commentsCount: { type: integer }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').notEmpty().withMessage('Invalid blog ID'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validationError,
  commentBlog,
);

/**
 * @openapi
 * /api/v1/comment/blog/{blogId}:
 *   get:
 *     tags: [Comments]
 *     summary: List comments for a blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of comments (key `comment` in JSON)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   type: array
 *                   items: { type: object }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').notEmpty().withMessage('Invalid blog ID'),
  getCommentsByBlog,
);

/**
 * @openapi
 * /api/v1/comment/blog/{commentId}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string, description: Comment Mongo ObjectId }
 *     responses:
 *       204:
 *         description: Comment deleted (no body)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not comment owner and not admin
 *       404:
 *         description: Comment or blog not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/blog/:commentId',
  authenticate,
  authorize(['admin', 'user']),
  param('commentId').notEmpty().withMessage('Invalid blog ID'),
  deleteCommentInBlog,
);

export default router;
