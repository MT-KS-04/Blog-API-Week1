/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */

import { Router } from 'express';
const router = Router();

/**
 * Routers
 */
import authRouter from './auth';
import userRouter from './user';
import blogRouter from './blog';

/**
 * Root Router
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(), // calculated in seconds
    server: 'Express + Node.js',
    docs: 'https://docs.blog-api.mk-ts-04.com',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/blogs', blogRouter);
export default router;
