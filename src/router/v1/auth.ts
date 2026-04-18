/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { Router } from 'express';
import { body, cookie } from 'express-validator';
import bcrypt from 'bcrypt';

/**
 * Controllers
 */
import register from 'src/controller/v1/auth/register';
import login from 'src/controller/v1/auth/login';
import refreshToken from 'src/controller/v1/auth/refresh_token';
import logout from 'src/controller/v1/auth/logout';

/**
 * Middlewares
 */
import validationError from 'src/middleware/validationError';

/**
 * Modules
 */
import User from 'src/model/user';
import authenticate from 'src/middleware/authenticate';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: |
 *       Username is generated server-side. Admin role is rejected unless the email is in the server allowlist (`WHITELIST_ADMIN_EMAIL`).
 *       Password rule: minimum **8** characters (`isLength({ min: 8 })`). Validator messages may incorrectly say "20 characters"; trust the min 8 rule.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, maxLength: 50 }
 *               password: { type: string, minLength: 8, description: Minimum 8 characters }
 *               role: { type: string, enum: [admin, user], description: Optional; default user }
 *     responses:
 *       200:
 *         description: User created; sets httpOnly `refreshToken` cookie; returns `accessToken` and `user` (includes hashed password field as stored — avoid exposing in clients)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     username: { type: string }
 *                     email: { type: string }
 *                     password: { type: string, description: Password hash }
 *                     role: { type: string, enum: [admin, user] }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       403:
 *         description: Cannot register as admin (email not allowlisted)
 *       500:
 *         description: Server error
 */
router.post(
  '/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (userExists) {
        throw new Error('Email already in use');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 20 characters long'),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user'),
  validationError,
  register,
);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     description: Password minimum **8** characters (same validator message quirk as register).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       200:
 *         description: Sets `refreshToken` cookie; returns `user` and `accessToken`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     username: { type: string }
 *                     email: { type: string }
 *                     password: { type: string }
 *                     role: { type: string }
 *       400:
 *         description: Validation error (wrong email/password flow returns 400 from validators)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: User not found (rare; most failures are 400 from validators)
 *       500:
 *         description: Server error
 */
router.post(
  '/login',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (!userExists) {
        throw new Error('User email or password is invalid');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 20 characters long')
    .custom(async (value, { req }) => {
      const { email } = req.body as { email: string };
      const user = await User.findOne({ email })
        .select('password')
        .lean()
        .exec();

      if (!user) {
        throw new Error('User password or email is invalid');
      }

      const passwordMatch = await bcrypt.compare(value, user.password);

      if (!passwordMatch) {
        throw new Error('User password or email is invalid');
      }
    }),
  validationError,
  login,
);

/**
 * @openapi
 * /api/v1/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Issue a new access token using refresh cookie
 *     security:
 *       - cookieRefreshToken: []
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *       400:
 *         description: Validation error (missing or invalid cookie format)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Invalid or expired refresh token
 *       404:
 *         description: Refresh token not recognized
 *       500:
 *         description: Server error
 */
router.post(
  '/refresh-token',
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token required')
    .isJWT()
    .withMessage('Invalid refresh token'),
  validationError,
  refreshToken,
);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Log out (clear refresh token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logged out; refresh cookie cleared
 *       401:
 *         description: Missing or invalid access token
 *       500:
 *         description: Server error
 */
router.post('/logout', authenticate, logout);
export default router;
