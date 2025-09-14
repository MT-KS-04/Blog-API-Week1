/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Models
 */
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * Custom Modules
 */
import { verifyAccessToken } from 'src/lib/jwt';
import { logger } from 'src/lib/winston';

/**
 * Types
 */
import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

/**
 * @function authenticate
 * @description Middleware to verify the user's access token from the Authorization header.
 *	       If the token is valid, the user's ID is attached to the request object.
 *	       Otherwise, it returns an appropriate error response.
 *
 * @param {Request} req header. Express request object. Expects a Bearer token in the Authorization
 * @param {Response} res authentication fails. Express response object used to send error responses if
 * @param {NextFunction} next Express next function to pass control to the next middleware.
 *
 * @returns {void}
 */

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // If there's no Bearer token, respond with 401 Unauthorized
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied, no token provided',
    });
    return;
  }

  // Split out the token from the 'Bearer' prefix
  const [_, token] = authHeader.split(' ');

  try {
    // Verify the token and extract the userId from the payload
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    // Attach the userId to the request object for later use
    req.userId = jwtPayload.userId;

    // Proceed to the next middleware or router handler
    return next();
  } catch (error) {
    // Handler expired token error
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token expired, request a new one with refresh token',
      });
      return;
    }

    // Handler invalid token error
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token invalid',
      });
      return;
    }

    // Catch-all for other access
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during authentication ', error);
  }
};

export default authenticate;
