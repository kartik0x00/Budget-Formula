import express, { Request, Response, NextFunction } from 'express';

// Production middleware checklist

// 1. Helmet - Security headers
import helmet from 'helmet';
app.use(helmet());

// 2. Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// 3. Request validation
import { body, validationResult } from 'express-validator';

// 4. Logging
import morgan from 'morgan';
app.use(morgan('combined'));

// 5. Compression
import compression from 'compression';
app.use(compression());

// Usage example for protected routes:
app.post('/api/auth/login',
  body('pin').isLength({ min: 4 }).trim(),
  body('userName').trim().notEmpty(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Handle login
  }
);

// Production tips:
// 1. Use environment variables for all config
// 2. Set NODE_ENV=production
// 3. Use a process manager (PM2)
// 4. Enable HTTPS
// 5. Set secure cookie flags
// 6. Implement request/response logging
// 7. Monitor error rates
// 8. Use database connection pooling
// 9. Implement graceful shutdown
// 10. Monitor memory usage

export {};
