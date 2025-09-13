/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Custom Modules
 */
import { logger } from 'src/lib/winston';
import config from 'src/config';
import { genUsername } from 'src/utils';
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

type UserData = Pick<IUse, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  if (role === 'admin' && !config.WHITELIST_ADMIN_EMAIL.includes(email)) {
    res.status(403).json({
      code: 'AuthorizationError',
      message: 'You cannot register as an admin',
    });

    logger.warn(
      `User with email ${email} tried to register as an admin but is not in the white list`,
    );

    return;
  }

  try {
    const username = genUsername();
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    // Generate access token and refresh token for new user
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in database
    await Token.create({ token: refreshToken, userId: newUser._id });
    logger.info('Refresh token create for new user', {
      userId: newUser._id,
      token: refreshToken,
    });

    await res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info('User register successfully', newUser);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during user registration', error);
  }
};

export default register;
