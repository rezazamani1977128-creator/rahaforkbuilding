import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  
  // Connection pool settings for scale
  pool: {
    min: parseInt(process.env.DB_POOL_MIN, 10) || 2,
    max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
  },
  
  // Query logging in development
  logging: process.env.NODE_ENV === 'development',
}));
