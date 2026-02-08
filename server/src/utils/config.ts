import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/budget-formula',
  pin: process.env.PIN || '1234',
  userName: process.env.USER_NAME || 'Kartik Upadhyay',
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
