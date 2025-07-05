import { HttpStatus } from '@nestjs/common';
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/error.constant';
import { IApiErrorDetail } from '../interfaces/api-response.interface';
import { BaseException } from './base.exception';

export class DatabaseException extends BaseException {
  constructor(message?: string, details?: IApiErrorDetail[]) {
    super(ERROR_CODES.DATABASE_ERROR, message, details, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class UniqueViolationException extends DatabaseException {
  constructor(message?: string, details?: IApiErrorDetail[]) {
    super(message || ERROR_MESSAGES[ERROR_CODES.UNIQUE_VIOLATION], details);
  }
} 