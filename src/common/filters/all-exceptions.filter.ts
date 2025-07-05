import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/error.constant';
import { ResponseHelper } from '../helpers/response.helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const requestId = uuidv4();

    // Log error with request details
    this.logger.error({
      exception,
      path: request.url,
      method: request.method,
      requestId,
      body: request.body,
      query: request.query,
      params: request.params,
    });

    let responseBody;
    let httpStatus;

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      httpStatus = exception.getStatus();

      // ถ้าเป็น response ที่สร้างจาก BaseException หรือ subclasses
      if (typeof response === 'object' && 'success' in response) {
        responseBody = response;
      } else {
        // แปลง NestJS built-in exceptions เป็นรูปแบบ response ของเรา
        responseBody = ResponseHelper.error(
          ERROR_CODES.VALIDATION_ERROR,
          typeof response === 'string' ? response : (response as any).message,
          Array.isArray((response as any).message)
            ? (response as any).message.map((msg: string) => ({ message: msg }))
            : undefined,
          requestId,
        );
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // จัดการ Prisma errors
      httpStatus = HttpStatus.BAD_REQUEST;
      switch (exception.code) {
        case 'P2002': // Unique constraint violation
          responseBody = ResponseHelper.error(
            ERROR_CODES.UNIQUE_VIOLATION,
            ERROR_MESSAGES[ERROR_CODES.UNIQUE_VIOLATION],
            undefined,
            requestId,
          );
          break;
        case 'P2025': // Record not found
          httpStatus = HttpStatus.NOT_FOUND;
          responseBody = ResponseHelper.error(
            ERROR_CODES.NOT_FOUND,
            ERROR_MESSAGES[ERROR_CODES.NOT_FOUND],
            undefined,
            requestId,
          );
          break;
        default:
          httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
          responseBody = ResponseHelper.error(
            ERROR_CODES.DATABASE_ERROR,
            ERROR_MESSAGES[ERROR_CODES.DATABASE_ERROR],
            undefined,
            requestId,
          );
      }
    } else {
      // Unknown errors
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = ResponseHelper.error(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
        undefined,
        requestId,
      );
    }

    // Add requestId to all error responses
    if (!responseBody.requestId) {
      responseBody.requestId = requestId;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
} 