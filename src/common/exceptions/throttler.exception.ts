import { ThrottlerException } from '@nestjs/throttler';

export class CustomThrottlerException extends ThrottlerException {
  constructor(
    ttl: number,
    limit: number,
    remainingAttempts: number,
    nextValidRequestTime: Date,
  ) {
    const details = {
      limit,
      timeWindowSeconds: ttl,
      remainingAttempts,
      nextValidRequestTime: nextValidRequestTime.toISOString(),
      waitTimeSeconds: Math.ceil((nextValidRequestTime.getTime() - Date.now()) / 1000),
    };

    super(`คุณส่งคำขอมากเกินไป กรุณารอ ${details.waitTimeSeconds} วินาที แล้วลองใหม่อีกครั้ง`);
    
    // เพิ่ม details เข้าไปใน error object
    Object.assign(this, { 
      statusCode: 429,
      error: 'Too Many Requests',
      details 
    });
  }
} 