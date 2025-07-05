import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class QueryBookDto {
  @ApiProperty({ 
    description: 'ค้นหาจากชื่อหนังสือ',
    required: false,
    example: 'นิยาย',
  })
  @IsString({ message: 'คำค้นหาชื่อหนังสือต้องเป็นข้อความ' })
  @IsOptional()
  @Matches(/^[ก-๙a-zA-Z0-9\s\-_.,!?()]*$/, {
    message: 'คำค้นหาชื่อหนังสือต้องไม่มีอักขระพิเศษ ยกเว้น - _ . , ! ? ( )',
  })
  @Transform(({ value }) => value?.trim())
  title?: string;

  @ApiProperty({ 
    description: 'ค้นหาจากชื่อผู้แต่ง',
    required: false,
    example: 'ทมยันตี',
  })
  @IsString({ message: 'คำค้นหาชื่อผู้แต่งต้องเป็นข้อความ' })
  @IsOptional()
  @Matches(/^[ก-๙a-zA-Z0-9\s\-_.]*$/, {
    message: 'คำค้นหาชื่อผู้แต่งต้องไม่มีอักขระพิเศษ ยกเว้น - _ .',
  })
  @Transform(({ value }) => value?.trim())
  author?: string;

  @ApiProperty({ 
    description: 'หน้าที่ต้องการ',
    minimum: 1,
    default: 1,
    required: false,
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'หน้าที่ต้องการต้องเป็นตัวเลขจำนวนเต็ม' })
  @Min(1, { message: 'หน้าที่ต้องการต้องไม่น้อยกว่า 1' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return 1;
    const num = parseInt(value);
    return isNaN(num) ? 1 : num;
  })
  page?: number = 1;

  @ApiProperty({ 
    description: 'จำนวนรายการต่อหน้า',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
    example: 10,
  })
  @Type(() => Number)
  @IsInt({ message: 'จำนวนรายการต่อหน้าต้องเป็นตัวเลขจำนวนเต็ม' })
  @Min(1, { message: 'จำนวนรายการต่อหน้าต้องไม่น้อยกว่า 1' })
  @Max(100, { message: 'จำนวนรายการต่อหน้าต้องไม่เกิน 100' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return 10;
    const num = parseInt(value);
    return isNaN(num) ? 10 : Math.min(num, 100);
  })
  limit?: number = 10;

  @ApiProperty({
    description: 'ค้นหาจากประเภทหนังสือ',
    required: false,
    example: 'นวนิยาย',
  })
  @IsString({ message: 'คำค้นหาประเภทหนังสือต้องเป็นข้อความ' })
  @IsOptional()
  @Matches(/^[ก-๙a-zA-Z0-9\s\-_]*$/, {
    message: 'คำค้นหาประเภทหนังสือต้องไม่มีอักขระพิเศษ ยกเว้น - _',
  })
  @Transform(({ value }) => value?.trim())
  genre?: string;
}