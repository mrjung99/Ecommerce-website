import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('E-commerce website')
    .setDescription('')
    .setVersion('1.0.0.0')
    .addTag('E-commerce')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

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

  // versioning
  app.setGlobalPrefix('api/v1');

  // cookie
  app.use(cookieParser());

  //CORS
  app.enableCors({ origin: process.env.FRONTEND_URL, Credential: true });

  //HELMET
  app.use(helmet());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application running on port: ${port}`);
}

bootstrap().catch((err) => {
  console.log('Application failed to start', err);
  process.exit(1);
});
