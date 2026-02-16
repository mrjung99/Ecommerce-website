
import { registerAs } from '@nestjs/config'


export default registerAs('database', () => ({
   type: process.env.DB_TYPE,
   synchronize: process.env.DB_SYNC,
   autoLoadEntities: process.env.DB_AUTOLOAD,
   host: process.env.DB_HOST || 'localhost',
   port: parseInt(process.env.DB_PORT ?? '5432', 10),
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   name: process.env.DB_NAME
}))