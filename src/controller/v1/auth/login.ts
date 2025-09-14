/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Custom Modules
 */
import { logger } from 'src/lib/winston';
import config from 'src/config';
import { generateAccessToken, generateRefreshToken } from 'src/lib/jwt';
/**
 * Models
 */
import User from 'src/model/user';
import Token from 'src/model/token';
/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUse } from 'src/model/user';

type UserData = Pick<IUse, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as UserData;

  try {
    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    // Generate access token and refresh token for new user
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in database
    await Token.create({ token: refreshToken, userId: user._id });
    logger.info('Refresh token create for new user', {
      userId: user._id,
      token: refreshToken,
    });

    await res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
      },
      accessToken,
    });

    logger.info('User login successfully', user);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during user login', error);
  }
};

export default login;
