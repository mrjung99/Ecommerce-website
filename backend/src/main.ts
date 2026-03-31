import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // cookie
  app.use(cookieParser());

  //CORS
  app.enableCors({ origin: process.env.FRONTEND_URL, Credential: true });

  //HELMET
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.log('Application failed to start', err);
  process.exit(1);
});
