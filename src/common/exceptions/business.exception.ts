import { HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from '../constants/error.constant';
import { IApiErrorDetail } from '../interfaces/api-response.interface';
import { BaseException } from './base.exception';

export class BusinessException extends BaseException {
  constructor(message?: string, details?: IApiErrorDetail[]) {
    super(ERROR_CODES.BUSINESS_ERROR, message, details, HttpStatus.UNPROCESSABLE_ENTITY);
  }
} 