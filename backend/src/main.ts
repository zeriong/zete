import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function bootstrap() {
  (async () => {
    try {
      const app = await NestFactory.create(AppModule);

      /** Swagger */
      const config = new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('v1')
        .build();
      const document = SwaggerModule.createDocument(app, config, {
        // 프론트의 코드젠 전략을 위한 operationId 커스텀
        operationIdFactory: (controllerKey, methodKey) => `${methodKey}`,
      });
      if (process.env.NODE_ENV !== 'production') {
        SwaggerModule.setup('api-docs', app, document, {
          yamlDocumentUrl: 'api-yaml',
        });
      }

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
          transformOptions: {
            enableImplicitConversion: true,
          },
          forbidUnknownValues: false,
        }),
      );

      console.log('***************************************');
      console.log('web start ', process.env.NODE_ENV, process.env.PORT);
      console.log('***************************************');

      await app.listen(process.env.PORT);
    } catch (e) {
      console.log(e);
    }
  })();
}
bootstrap();
