import { Router, Request, Response } from 'express';
import { config } from '../utils/config.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ValidationError, AuthenticationError } from '../utils/errors.js';

const router = Router();

// Login endpoint
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { pin, userName } = req.body;

    if (!pin || !userName) {
      throw new ValidationError('PIN and username are required');
    }

    if (pin !== config.pin) {
      throw new AuthenticationError('Invalid PIN');
    }

    if (userName !== config.userName) {
      throw new AuthenticationError('Invalid user');
    }

    const token = `${pin}:${userName}`;

    res.json({
      success: true,
      data: {
        token,
        user: {
          name: userName,
        },
      },
    });
  })
);

// Verify token endpoint
router.post(
  '/verify',
  asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
      throw new ValidationError('Token is required');
    }

    const [pin, userName] = token.split(':');

    if (!pin || !userName) {
      throw new AuthenticationError('Invalid token format');
    }

    if (pin !== config.pin || userName !== config.userName) {
      throw new AuthenticationError('Invalid token');
    }

    res.json({
      success: true,
      data: {
        user: {
          name: userName,
        },
      },
    });
  })
);

// Get user info
router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        user: {
          name: req.user?.userName || config.userName,
        },
      },
    });
  })
);

export default router;
