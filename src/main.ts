import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: true, // หรือระบุ domain ที่อนุญาต เช่น ['http://localhost:3000']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global Prefix (optional)
  app.setGlobalPrefix('api');

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // ลบ properties ที่ไม่ได้ declare ใน DTO ออก
    forbidNonWhitelisted: true, // ส่ง error ถ้ามี properties ที่ไม่ได้ declare
    transform: true, // แปลง payload เป็น DTO instance
    transformOptions: {
      enableImplicitConversion: true, // แปลง type อัตโนมัติ เช่น string เป็น number
    },
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // ใช้ 422 แทน 400
  }));

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Book Management API')
    .setDescription('API สำหรับระบบจัดการหนังสือ')
    .setVersion('1.0')
    .addTag('Books', 'endpoints สำหรับจัดการข้อมูลหนังสือ')
    .addBearerAuth() // ถ้าต้องการใช้ JWT authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Book Management API Documentation',
  });

  // Start Server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api-docs`);
}

bootstrap();