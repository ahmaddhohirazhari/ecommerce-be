import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';
import User from '../modules/user/user.model';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Cara terbaik untuk mendapatkan token
    const authHeader = req.get('Authorization') || req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required',
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      role: string;
    };

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
      raw: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = user;
    next();
  } catch (error: any) {
    const message =
      error.name === 'JsonWebTokenError'
        ? 'Invalid token'
        : error.message || 'Authentication failed';

    res.status(401).json({
      success: false,
      message,
    });
  }
};

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};
