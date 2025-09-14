/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Custom Modules
 */
import { logger } from 'src/lib/winston';

/**
 * Models
 */
import User from 'src/model/user';

/**
 * Types
 */
import type { Request, Response } from 'express';

const updateCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;

  const {
    username,
    email,
    password,
    first_name,
    last_name,
    website,
    facebook,
    instagram,
    linkedin,
    x,
    youtube,
  } = req.body;
  try {
    const user = await User.findById(userId).select('+password -__v').exec();

    if (!user) {
      res.status(404).json({
        code: 'NodeFound',
        message: 'User not found',
      });
      return;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (first_name) user.firstName = first_name;
    if (last_name) user.lastName = last_name;
    if (!user.socialLink) {
      user.socialLink = {};
    }
    if (website) user.socialLink.website = website;
    if (facebook) user.socialLink.facebook = facebook;
    if (instagram) user.socialLink.instagram = instagram;
    if (linkedin) user.socialLink.linkedin = linkedin;
    if (x) user.socialLink.x = x;
    if (youtube) user.socialLink.youtube = youtube;

    await user.save();

    logger.info('User updating successfully', user);

    res.status(200).json({
      code: 'User update successfully',
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error while updating current user', error);
  }
};

export default updateCurrentUser;
