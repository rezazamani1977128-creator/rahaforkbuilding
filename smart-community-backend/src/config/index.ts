import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import redisConfig from './redis.config';
import smsConfig from './sms.config';
import paymentConfig from './payment.config';

export default [
  appConfig,
  databaseConfig,
  jwtConfig,
  redisConfig,
  smsConfig,
  paymentConfig,
];

export {
  appConfig,
  databaseConfig,
  jwtConfig,
  redisConfig,
  smsConfig,
  paymentConfig,
};
