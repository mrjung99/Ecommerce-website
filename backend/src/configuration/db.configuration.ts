import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const pgConfig: TypeOrmModuleOptions = {
  url: 'postgresql://neondb_owner:npg_Sau1Uq8bsiJT@ep-still-boat-a124ubn1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require',
  type: 'postgres',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
  ssl: { rejectUnauthorized: false },
};
