# 📚 Book Management API

ระบบจัดการหนังสือ API สำหรับการจัดเก็บและค้นหาข้อมูลหนังสือ พัฒนาด้วย NestJS

## 🚀 Features

### 🔐 Security
- Rate Limiting ป้องกัน DDoS และ Brute Force
- Helmet Security Headers
- CORS Protection
- Input Validation & Sanitization

### 🛠 Error Handling
- Custom Error Response Format
- ข้อความ Error ภาษาไทย
- Global Exception Filter
- Request ID Tracking

### ✨ API Features
- RESTful Endpoints
- Pagination
- Filtering & Searching
- Data Validation
- Swagger Documentation

### 🧪 Testing
- Unit Tests
- Integration Tests
- E2E Tests
- Test Coverage Reports

## 🛠 Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL + Prisma ORM
- **Documentation**: Swagger
- **Testing**: Jest
- **Deployment**: Coolify

## 📋 Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm หรือ yarn

## ⚙️ Installation

1. Clone โปรเจค:
```bash
git clone <repository-url>
cd book-management-api
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3. ตั้งค่า environment variables:
```bash
cp .env.example .env
# แก้ไขค่าใน .env ตามที่ต้องการ
```

4. รัน database migrations:
```bash
npx prisma migrate dev
```

## 🚀 Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## 🧪 Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## 📚 API Documentation

เมื่อรันโปรเจค สามารถเข้าดู API Documentation ได้ที่:
- Swagger UI: `http://localhost:3001/api-docs`

## 🔒 Rate Limiting

- **GET endpoints**: 200 requests/minute
- **POST, PUT, DELETE endpoints**: 30 requests/minute
- **Search endpoints**: 50 requests/minute

## 🌟 Error Responses

ทุก error responses จะมีรูปแบบดังนี้:
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "ข้อความอธิบายข้อผิดพลาด",
  "requestId": "unique-request-id"
}
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | พอร์ตที่ใช้รัน API | 3001 |
| DATABASE_URL | PostgreSQL connection string | - |
| NODE_ENV | environment (development/production) | development |

