# Book Management API Endpoints

## GET /books
ดึงรายการหนังสือ
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10) 
- search: string (optional)
- genre: string (optional)
- author: string (optional)
Rate Limit: 200 requests/minute
```

## GET /books/:id 
ดูรายละเอียดหนังสือ
```
Parameters:
- id: number
Rate Limit: 200 requests/minute
```

## POST /books
เพิ่มหนังสือใหม่
```
Body:
{
  "title": "string (1-255 ตัวอักษร)",
  "author": "string (1-100 ตัวอักษร)", 
  "published_year": "number (1000-ปีปัจจุบัน)",
  "genre": "string (1-50 ตัวอักษร)"
}
Rate Limit: 30 requests/minute
```

## PATCH /books/:id
แก้ไขข้อมูลหนังสือ
```
Parameters:
- id: number
Body (ทุกฟิลด์เป็น optional):
{
  "title?": "string",
  "author?": "string",
  "published_year?": "number",
  "genre?": "string"
}
Rate Limit: 30 requests/minute
```

## DELETE /books/:id
ลบหนังสือ
```
Parameters:
- id: number
Rate Limit: 30 requests/minute
```

## Response Format

### Success Response:
```json
{
  "data": {}, // ข้อมูลที่ร้องขอ
  "meta": {   // สำหรับ pagination
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

### Error Response:
```json
{
  "statusCode": "number",
  "error": "string",
  "message": "string",
  "requestId": "string"
}
```

## Validation Rules
- title: 1-255 ตัวอักษร, ไม่มีอักขระพิเศษ (ยกเว้น - _ . , ! ? ( ))
- author: 1-100 ตัวอักษร, ไม่มีอักขระพิเศษ (ยกเว้น - _ .)
- published_year: ตั้งแต่ปี 1000 ถึงปีปัจจุบัน
- genre: 1-50 ตัวอักษร, ไม่มีอักขระพิเศษ (ยกเว้น - _)

## Rate Limiting
- GET endpoints: 200 requests/minute
- POST, PATCH, DELETE endpoints: 30 requests/minute 