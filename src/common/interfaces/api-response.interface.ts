import { ApiProperty } from '@nestjs/swagger';

export interface IApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export class ApiErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'VALIDATION_ERROR' })
  error: string;

  @ApiProperty({ example: 'Invalid input data' })
  message: string;

  @ApiProperty({
    example: [
      {
        field: 'email',
        message: 'Email must be a valid email address',
        code: 'invalid_email_format'
      }
    ],
    required: false
  })
  details?: IApiErrorDetail[];

  @ApiProperty({ example: '2024-03-19T12:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: 'req-123-456' })
  requestId?: string;
}

export class ApiSuccessResponse<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: '2024-03-19T12:00:00.000Z' })
  timestamp: string;
} 