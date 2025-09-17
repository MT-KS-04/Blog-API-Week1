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
import config from 'src/config';
import { logger } from './winston';

/**
 * Types
 */
import type { UploadApiResponse } from 'cloudinary';
import { buffer } from 'stream/consumers';
import { resolve } from 'path';
import { rejects } from 'assert';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: config.NODE_ENV === 'production',
});

const uploadToCloudinary = (
  buffer: Buffer<ArrayBufferLike>,
  publicId?: string,
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, rejects) => {
    cloudinary.uploader
      .upload_stream(
        {
          allowed_formats: ['png', 'jpg', 'webp'],
          resource_type: 'image',
          folder: 'blog-api',
          public_id: publicId,
          transformation: { quality: 'auto' },
        },
        (err, result) => {
          if (err) {
            logger.error('Error uploading image to Cloudinary', err);
            rejects(err);
          }

          resolve(result);
        },
      )
      .end(buffer);
  });
};

export default uploadToCloudinary;
