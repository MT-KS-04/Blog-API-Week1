/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
/**
 * Custom Modules
 */
import { verifyRefreshToken, generateAccessToken } from 'src/lib/jwt';
import { logger } from 'src/lib/winston';

/**
 * Models
 */
import Token from 'src/model/token';

/**
 * Types
 */
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    const tokenExits = await Token.exists({ token: refreshToken });

    if (!tokenExits) {
      res.status(404).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }
    // Verify Refresh Token
    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    const accessToken = generateAccessToken(jwtPayload.userId);

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Refresh token expired, please login again',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during refresh token', error);
  }
};

export default refreshToken;
