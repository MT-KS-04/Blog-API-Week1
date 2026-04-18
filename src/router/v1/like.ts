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

/**
 * @openapi
 * /api/v1/likes/blog/{blogId}:
 *   post:
 *     tags: [Likes]
 *     summary: Like a blog
 *     description: |
 *       Requires `userId` in JSON body (Mongo ObjectId). The handler uses it as given (ensure it matches the authenticated user on the client).
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
 *             required: [userId]
 *             properties:
 *               userId: { type: string, description: Mongo ObjectId of user }
 *     responses:
 *       200:
 *         description: Like recorded; returns updated `likesCount`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likesCount: { type: integer }
 *       400:
 *         description: Validation error, or already liked this blog
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - type: object
 *                   properties:
 *                     code: { type: string, example: BadRequest }
 *                     message: { type: string }
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
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  validationError,
  likeBlogs,
);

/**
 * @openapi
 * /api/v1/likes/blog/{blogId}:
 *   delete:
 *     tags: [Likes]
 *     summary: Unlike a blog
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
 *             required: [userId]
 *             properties:
 *               userId: { type: string }
 *     responses:
 *       204:
 *         description: Unlike applied (no body)
 *       400:
 *         description: Validation error, or like not found for this user/blog
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - type: object
 *                   properties:
 *                     code: { type: string, example: NotFound }
 *                     message: { type: string }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found (after unlike path)
 *       500:
 *         description: Server error
 */
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
