import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { CustomThrottlerException } from '../exceptions/throttler.exception';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const { limit, ttl } = throttlerLimitDetail;
    const now = new Date();
    const nextValidRequestTime = new Date(now.getTime() + ttl * 1000);
    const remainingAttempts = 0; // เมื่อเกิด exception แสดงว่าใช้ครบแล้ว

    throw new CustomThrottlerException(
      ttl,
      limit,
      remainingAttempts,
      nextValidRequestTime,
    );
  }
} 