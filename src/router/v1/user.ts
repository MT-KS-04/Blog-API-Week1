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
/**
 * Models
 */
import User from 'src/model/user';
import user from 'src/model/user';

const router = Router();

router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
);

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

export default router;
