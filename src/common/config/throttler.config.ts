import { ThrottlerModuleOptions } from '@nestjs/throttler';

/**
 * Rate Limiting Configuration
 * ttl: Time To Live (วินาที)
 * limit: จำนวนครั้งที่อนุญาตให้เรียก API ใน ttl วินาที
 */
export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [{
    ttl: 60, // 60 วินาที
    limit: 100, // 100 requests ต่อ 60 วินาที
  }],
};

// Rate Limit สำหรับแต่ละประเภท Route
export const routeThrottlers = {
  // Routes ที่ต้องการความปลอดภัยสูง (POST, PUT, DELETE)
  secure: {
    ttl: 60,
    limit: 30, // 30 requests ต่อ 60 วินาที
  },
  // Routes ที่ใช้ทรัพยากรมาก (Search, Filter)
  intensive: {
    ttl: 60,
    limit: 50, // 50 requests ต่อ 60 วินาที
  },
  // Routes ที่เรียกบ่อย (GET)
  frequent: {
    ttl: 60,
    limit: 200, // 200 requests ต่อ 60 วินาที
  },
}; 