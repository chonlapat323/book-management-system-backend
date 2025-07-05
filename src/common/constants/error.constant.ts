export const ERROR_CODES = {
  // System Errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resource Errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Business Logic Errors
  BUSINESS_ERROR: 'BUSINESS_ERROR',
  INVALID_OPERATION: 'INVALID_OPERATION',
  
  // Database Errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNIQUE_VIOLATION: 'UNIQUE_VIOLATION',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'เกิดข้อผิดพลาดภายในระบบ',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'ระบบไม่สามารถให้บริการได้ชั่วคราว',
  [ERROR_CODES.VALIDATION_ERROR]: 'ข้อมูลไม่ถูกต้อง',
  [ERROR_CODES.INVALID_INPUT]: 'ข้อมูลที่ระบุไม่ถูกต้อง',
  [ERROR_CODES.NOT_FOUND]: 'ไม่พบข้อมูลที่ต้องการ',
  [ERROR_CODES.ALREADY_EXISTS]: 'ข้อมูลนี้มีอยู่ในระบบแล้ว',
  [ERROR_CODES.BUSINESS_ERROR]: 'เกิดข้อผิดพลาดทางธุรกิจ',
  [ERROR_CODES.INVALID_OPERATION]: 'การดำเนินการไม่ถูกต้อง',
  [ERROR_CODES.DATABASE_ERROR]: 'เกิดข้อผิดพลาดในการเข้าถึงฐานข้อมูล',
  [ERROR_CODES.UNIQUE_VIOLATION]: 'ข้อมูลซ้ำกับที่มีอยู่ในระบบ',
} as const; 