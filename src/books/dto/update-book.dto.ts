import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateBookDto implements Partial<Prisma.BookUpdateInput> {
  @ApiProperty({ 
    description: 'ชื่อหนังสือ',
    example: 'The Great Gatsby',
    required: false 
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ 
    description: 'ชื่อผู้แต่ง',
    example: 'F. Scott Fitzgerald',
    required: false 
  })
  @IsString()
  @IsOptional()
  author?: string;

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
}