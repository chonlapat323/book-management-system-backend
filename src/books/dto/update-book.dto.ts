import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min
} from 'class-validator';

export class UpdateBookDto implements Partial<Prisma.BookUpdateInput> {
  @ApiProperty({ 
    description: 'ชื่อหนังสือ',
    example: 'แฮร์รี่ พอตเตอร์',
    required: false,
    minLength: 1,
    maxLength: 255
  })
  @IsString({ message: 'ชื่อหนังสือต้องเป็นข้อความ' })
  @Length(1, 255, { message: 'ชื่อหนังสือต้องมีความยาวระหว่าง 1 ถึง 255 ตัวอักษร' })
  @Matches(/^[ก-๙a-zA-Z0-9\s\-_.,!?()]*$/, {
    message: 'ชื่อหนังสือต้องไม่มีอักขระพิเศษ ยกเว้น - _ . , ! ? ( )',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '') return undefined;
    return value?.trim();
  })
  title?: string;

  @ApiProperty({ 
    description: 'ชื่อผู้แต่ง',
    example: 'เจ.เค. โรว์ลิ่ง',
    required: false,
    minLength: 1,
    maxLength: 100
  })
  @IsString({ message: 'ชื่อผู้แต่งต้องเป็นข้อความ' })
  @Length(1, 100, { message: 'ชื่อผู้แต่งต้องมีความยาวระหว่าง 1 ถึง 100 ตัวอักษร' })
  @Matches(/^[ก-๙a-zA-Z0-9\s\-_.]*$/, {
    message: 'ชื่อผู้แต่งต้องไม่มีอักขระพิเศษ ยกเว้น - _ .',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '') return undefined;
    return value?.trim();
  })
  author?: string;

  @ApiProperty({ 
    description: 'ปีที่พิมพ์',
    example: 2020,
    required: false,
    nullable: true,
    minimum: 1000,
    maximum: new Date().getFullYear()
  })
  @IsInt({ message: 'ปีที่พิมพ์ต้องเป็นตัวเลขจำนวนเต็ม' })
  @Min(1000, { message: 'ปีที่พิมพ์ต้องไม่น้อยกว่าปี 1000' })
  @Max(new Date().getFullYear(), { message: 'ปีที่พิมพ์ต้องไม่เกินปีปัจจุบัน' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '') return null;
    if (value === undefined || value === null) return value;
    const num = parseInt(value);
    return isNaN(num) ? undefined : num;
  })
  published_year?: number | null;

  @ApiProperty({ 
    description: 'ประเภทหนังสือ',
    example: 'แฟนตาซี',
    required: false,
    nullable: true,
    minLength: 1,
    maxLength: 50
  })
  @IsString({ message: 'ประเภทหนังสือต้องเป็นข้อความ' })
  @Length(1, 50, { message: 'ประเภทหนังสือต้องมีความยาวระหว่าง 1 ถึง 50 ตัวอักษร' })
  @Matches(/^[ก-๙a-zA-Z0-9\s\-_]*$/, {
    message: 'ประเภทหนังสือต้องไม่มีอักขระพิเศษ ยกเว้น - _',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '') return null;
    if (value === undefined || value === null) return value;
    return value.trim();
  })
  genre?: string | null;
}