import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryBookDto {
  @ApiProperty({ 
    description: 'ค้นหาจากชื่อหนังสือ',
    required: false 
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ 
    description: 'ค้นหาจากชื่อผู้แต่ง',
    required: false 
  })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ 
    description: 'หน้าที่ต้องการ',
    minimum: 1,
    default: 1,
    required: false 
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ 
    description: 'จำนวนรายการต่อหน้า',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false 
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}