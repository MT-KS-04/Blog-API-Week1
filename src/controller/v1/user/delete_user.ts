/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { v2 as cloudinary } from 'cloudinary';

/**
 * Custom Modules
 */
import { logger } from 'src/lib/winston';

/**
 * Models
 */
import User from 'src/model/user';
import Blog from 'src/model/blog';

/**
 * Types
 */
import type { Request, Response } from 'express';

const deleteCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();

    const publicIds = blogs.map(({ banner }) => banner.publicId);

    await cloudinary.api.delete_resources(publicIds);

    await Blog.deleteMany({ author: userId });

    logger.info('Multiple blogs deleted', {
      userId,
      blogs,
    });

    logger.info('Multiple blog banners deleted from Cloudinary');
    await User.deleteOne({ _id: userId });

    logger.info('A user account has been deleted', { userId });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error while deleting current user account', error);
  }
};

export default deleteCurrentUser;
