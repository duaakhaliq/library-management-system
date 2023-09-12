import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './shared/role/role.guard';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new RolesGuard(new Reflector()));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Library Management System')
    .setDescription('API documentation for the Library Management System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'JWT',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(3000);
}
bootstrap();
