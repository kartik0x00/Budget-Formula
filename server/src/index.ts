import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './utils/config.js';
import { errorHandler, asyncHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import budgetRouter from './routes/budget.js';
import authRouter from './routes/auth.js';

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (config.nodeEnv === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Auth routes (no authentication required)
app.use('/api/auth', authRouter);

// Budget routes (authentication required)
app.use('/api/budget', authMiddleware, budgetRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✓ MongoDB connected');

    app.listen(config.port, () => {
      console.log(`✓ Server running on http://localhost:${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
