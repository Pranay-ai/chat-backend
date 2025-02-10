import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for localhost:5173
  app.enableCors({
    origin: process.env.FRONTEND_URL, // Allow requests from this frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and auth headers
  });

  // ✅ Enable Validation Pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // ✅ Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', // Security name reference
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidocs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
