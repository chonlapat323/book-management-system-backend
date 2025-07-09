import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Headers with Helmet
  app.use(helmet());

  // CORS
  app.enableCors({
    // อนุญาตเฉพาะ domains ที่กำหนด
    origin: process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://paodev.xyz']
      : ['http://localhost:3000', 'http://localhost:3001', 'https://book.paodev.xyz/'],
    
    // อนุญาตเฉพาะ methods ที่ใช้งาน
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    
    // อนุญาต credentials (cookies, authorization headers)
    credentials: true,
    
    // กำหนด headers ที่อนุญาต
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Credentials',
    ],
    
    // กำหนด headers ที่ client สามารถเข้าถึงได้
    exposedHeaders: ['Content-Disposition'],
    
    // ระยะเวลาที่ browser จะ cache preflight request (30 นาที)
    maxAge: 1800,
    
    // HTTP status code สำหรับ successful OPTIONS requests
    optionsSuccessStatus: 204,
  });

  // Global Prefix (optional)
  app.setGlobalPrefix('api');

  // Global Exception Filter
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

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
    useGlobalPrefix: false,
  });

  // Start Server
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api-docs`);
}

bootstrap();