import { HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from '../constants/error.constant';
import { IApiErrorDetail } from '../interfaces/api-response.interface';
import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(message?: string, details?: IApiErrorDetail[]) {
    super(ERROR_CODES.NOT_FOUND, message, details, HttpStatus.NOT_FOUND);
  }
} 