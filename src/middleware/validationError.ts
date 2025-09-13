/**
 * @copyright 2025 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { validationResult } from 'express-validator';

/**
 * Types
 */
import { Request, Response, NextFunction } from 'express';

const validationError = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({
      code: 'ValidationError',
      errors: error.mapped(),
    });
  }
  next();
};

export default validationError;
