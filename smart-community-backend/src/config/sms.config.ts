import { registerAs } from '@nestjs/config';

export default registerAs('sms', () => ({
  provider: process.env.SMS_PROVIDER || 'kavenegar',
  enabled: process.env.SMS_ENABLED !== 'false',
  
  kavenegar: {
    apiKey: process.env.KAVENEGAR_API_KEY || '',
    sender: process.env.KAVENEGAR_SENDER || '',
    templateOtp: process.env.KAVENEGAR_TEMPLATE_OTP || 'verify',
  },
  
  templates: {
    otp: 'ساختمان من\nکد تأیید: {code}\nاین کد تا {minutes} دقیقه معتبر است.',
    welcome: 'به ساختمان من خوش آمدید! حساب شما با موفقیت ایجاد شد.',
    paymentReminder: 'یادآوری: شارژ {month} به مبلغ {amount} تومان تا {dueDate} مهلت پرداخت دارد.\nساختمان من',
    paymentReceived: 'پرداخت شما به مبلغ {amount} تومان با موفقیت ثبت شد.\nکد پیگیری: {trackingCode}\nساختمان من',
    paymentOverdue: 'شارژ {month} به مبلغ {amount} تومان معوق شده است. لطفاً هرچه سریع‌تر پرداخت کنید.\nساختمان من',
  },
}));
