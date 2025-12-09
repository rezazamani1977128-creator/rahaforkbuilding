import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  
  prefix: {
    session: 'session:',
    otp: 'otp:',
    cache: 'cache:',
    rateLimit: 'rate:',
    lock: 'lock:',
  },
  
  ttl: {
    default: 300,
    short: 60,
    medium: 900,
    long: 3600,
    veryLong: 86400,
  },
}));
