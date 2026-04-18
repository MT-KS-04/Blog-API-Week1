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
import likeRouter from './like';
import commentRouter from './comment';

/**
 * Root Router
 */

/**
 * @openapi
 * /api/v1/:
 *   get:
 *     tags: [Health]
 *     summary: Health check and API metadata
 *     responses:
 *       200:
 *         description: Service is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: API is live }
 *                 status: { type: string, example: ok }
 *                 version: { type: string, example: 1.0.0 }
 *                 environment: { type: string }
 *                 uptime: { type: number, description: Seconds since process start }
 *                 server: { type: string }
 *                 docs: { type: string, format: uri }
 *                 timestamp: { type: string, format: date-time }
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
router.use('/likes', likeRouter);
router.use('/comment/', commentRouter);

export default router;
