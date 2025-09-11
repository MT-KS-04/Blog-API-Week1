/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Controllers
 */
import register from 'src/controller/v1/auth/register';

/**
 * Middlewares
 */

/**
 * Modules
 */

const router = Router();

router.post('/register', register);

export default router;
