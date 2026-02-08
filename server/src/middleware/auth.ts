import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../utils/errors.js';
import { config } from '../utils/config.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userName: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);

  // Token format: pin:username
  const [pin, userName] = token.split(':');

  if (!pin || !userName) {
    throw new AuthenticationError('Invalid token format');
  }

  if (pin !== config.pin) {
    throw new AuthenticationError('Invalid PIN');
  }

  if (userName !== config.userName) {
    throw new AuthenticationError('Invalid user');
  }

  req.user = { userName };
  next();
};
