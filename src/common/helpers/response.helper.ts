import { ERROR_CODES, ERROR_MESSAGES } from '../constants/error.constant';
import { ApiErrorResponse, ApiSuccessResponse, IApiErrorDetail } from '../interfaces/api-response.interface';

export class ResponseHelper {
  static success<T>(data: T): ApiSuccessResponse<T> {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(
    error: string = ERROR_CODES.INTERNAL_SERVER_ERROR,
    message?: string,
    details?: IApiErrorDetail[],
    requestId?: string,
  ): ApiErrorResponse {
    return {
      success: false,
      error,
      message: message || ERROR_MESSAGES[error] || 'Unknown error',
      details,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  static validationError(
    details: IApiErrorDetail[],
    message: string = ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR],
  ): ApiErrorResponse {
    return this.error(ERROR_CODES.VALIDATION_ERROR, message, details);
  }

  static notFound(
    message: string = ERROR_MESSAGES[ERROR_CODES.NOT_FOUND],
    details?: IApiErrorDetail[],
  ): ApiErrorResponse {
    return this.error(ERROR_CODES.NOT_FOUND, message, details);
  }
} 