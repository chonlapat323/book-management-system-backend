import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/error.constant';
import { IApiErrorDetail } from '../interfaces/api-response.interface';

export class BaseException extends HttpException {
  constructor(
    error: string = ERROR_CODES.INTERNAL_SERVER_ERROR,
    message?: string,
    details?: IApiErrorDetail[],
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(
      {
        success: false,
        error,
        message: message || ERROR_MESSAGES[error] || 'Unknown error',
        details,
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
} 