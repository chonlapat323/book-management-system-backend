import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateBookDto implements Prisma.BookCreateInput {
  @ApiProperty({ 
    description: 'ชื่อหนังสือ',
    example: 'The Great Gatsby' 
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    description: 'ชื่อผู้แต่ง',
    example: 'F. Scott Fitzgerald' 
  })
  @IsString()
  author: string;

  @ApiProperty({ 
    description: 'ปีที่พิมพ์',
    example: 1925,
    required: false,
    nullable: true
  })
  @IsInt()
  @Min(1000)
  @Max(2024)
  @IsOptional()
  published_year?: number | null;

  @ApiProperty({ 
    description: 'ประเภทหนังสือ',
    example: 'Fiction',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  genre?: string | null;

  // ไม่ต้องใส่ created_at และ updated_at เพราะ Prisma จะจัดการให้อัตโนมัติ
}