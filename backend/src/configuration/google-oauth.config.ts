import { registerAs } from '@nestjs/config';

export default registerAs('googleOauth', () => ({
  secret: process.env.GOOGLE_CLIENT_SECRET!,
  clientId: process.env.GOOGLE_CLIENT_ID!,
  callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
}));
