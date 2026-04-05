import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  userName: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
}));
