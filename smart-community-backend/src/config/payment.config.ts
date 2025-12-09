import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  provider: process.env.PAYMENT_PROVIDER || 'zarinpal',
  enabled: process.env.PAYMENT_ENABLED !== 'false',
  
  zarinpal: {
    merchantId: process.env.ZARINPAL_MERCHANT_ID || '',
    sandbox: process.env.NODE_ENV !== 'production',
    callbackUrl: process.env.ZARINPAL_CALLBACK_URL || 'http://localhost:3000/api/v1/payments/verify',
  },
  
  minAmount: parseInt(process.env.MIN_PAYMENT_AMOUNT || '1000', 10),
}));
