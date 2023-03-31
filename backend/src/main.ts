import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { useOpenApi } from './openApi';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    await useOpenApi(app);

    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    });

    app.use(cookieParser());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    console.log('***************************************');
    console.log('web start ', process.env.NODE_ENV, process.env.PORT);
    console.log('***************************************');

    await app.listen(process.env.PORT);
  } catch (e) {
    console.log(e);
  }
}
bootstrap();
