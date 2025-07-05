import { HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from '../constants/error.constant';
import { IApiErrorDetail } from '../interfaces/api-response.interface';
import { BaseException } from './base.exception';

export class ValidationException extends BaseException {
  constructor(details: IApiErrorDetail[], message?: string) {
    super(ERROR_CODES.VALIDATION_ERROR, message, details, HttpStatus.BAD_REQUEST);
  }
} 