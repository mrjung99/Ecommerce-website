import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const pgConfig: TypeOrmModuleOptions = {
  url: process.env.DB_CONN_URL,
  type: 'postgres',
  //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
  ssl: { rejectUnauthorized: false },
};
