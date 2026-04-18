/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { Router } from 'express';
import { param, body, query } from 'express-validator';
/**
 * Custom Modules
 */

/**
 * Middlewares
 */
import validationError from 'src/middleware/validationError';
import authenticate from 'src/middleware/authenticate';
import authorize from 'src/middleware/authorize';

/**
 * Controllers
 */
import getCurrentUser from 'src/controller/v1/user/get_current_user';
import updateCurrentUser from 'src/controller/v1/user/update_current_user';
import deleteCurrentUser from 'src/controller/v1/user/delete_user';
import getAllCurrentUser from 'src/controller/v1/user/get_all_current_user';
import getUserByID from 'src/controller/v1/user/get_user_by_id';
import deleteUserByID from 'src/controller/v1/user/delete_user_by_id';
/**
 * Models
 */
import User from 'src/model/user';

const router = Router();

/**
 * @openapi
 * /api/v1/users/current:
 *   get:
 *     tags: [Users]
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
);

/**
 * @openapi
 * /api/v1/users/current:
 *   put:
 *     tags: [Users]
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string, maxLength: 20 }
 *               email: { type: string, format: email, maxLength: 50 }
 *               password: { type: string, minLength: 8 }
 *               first_name: { type: string, maxLength: 20 }
 *               last_name: { type: string, maxLength: 20 }
 *               website: { type: string, format: uri, maxLength: 100 }
 *               facebook: { type: string, format: uri, maxLength: 100 }
 *               instagram: { type: string, format: uri, maxLength: 100 }
 *               linkedin: { type: string, format: uri, maxLength: 100 }
 *               x: { type: string, format: uri, maxLength: 100 }
 *               youtube: { type: string, format: uri, maxLength: 100 }
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  body('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username must be less than 20 characters')
    .custom(async (value) => {
      const userExists = await User.exists({ username: value });

      if (userExists) {
        throw new Error('This username is already in use');
      }
    }),
  body('email')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });

      if (userExists) {
        throw new Error('This email is already in use');
      }
    }),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('first_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'),
  body('last_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'),
  body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('Invalid URl')
    .isLength({ max: 100 })
    .withMessage('Url must be less than 100 characters'),
  validationError,
  updateCurrentUser,
);

/**
 * @openapi
 * /api/v1/users/current:
 *   delete:
 *     tags: [Users]
 *     summary: Delete current user account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Account deleted (no body)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  deleteCurrentUser,
);

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: List users (admin only)
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
 *         description: Paginated users
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
  getAllCurrentUser,
);

/**
 * @openapi
 * /api/v1/users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, description: Mongo ObjectId }
 *     responses:
 *       200:
 *         description: User document
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not admin
 *       404:
 *         description: User not found
 */
router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
  validationError,
  getUserByID,
);

/**
 * @openapi
 * /api/v1/users/{userId}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: User and related blogs removed (no body)
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not admin
 *       404:
 *         description: User not found (controller path)
 *       500:
 *         description: Server error
 */
router.delete(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
  validationError,
  deleteUserByID,
);

export default router;
