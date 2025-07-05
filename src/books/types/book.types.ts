import { ApiProperty } from '@nestjs/swagger';
import { Book } from '@prisma/client';

export class BookResponse implements Partial<Book> {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'The Great Gatsby' })
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  author: string;

  @ApiProperty({ 
    example: 1925, 
    required: false, 
    nullable: true,
    description: 'ปีที่พิมพ์หนังสือ' 
  })
  published_year: number | null;

  @ApiProperty({ 
    example: 'Fiction', 
    required: false, 
    nullable: true,
    description: 'ประเภทของหนังสือ' 
  })
  genre: string | null;

  @ApiProperty({ 
    required: false, 
    nullable: true,
    description: 'วันที่สร้างข้อมูล' 
  })
  created_at: Date | null;

  @ApiProperty({ 
    required: false, 
    nullable: true,
    description: 'วันที่แก้ไขข้อมูลล่าสุด' 
  })
  updated_at: Date | null;
}

export class PaginationMeta {
  @ApiProperty({ 
    example: 100,
    description: 'จำนวนรายการทั้งหมด' 
  })
  total: number;

  @ApiProperty({ 
    example: 1,
    description: 'หน้าปัจจุบัน' 
  })
  page: number;

  @ApiProperty({ 
    example: 10,
    description: 'จำนวนรายการต่อหน้า' 
  })
  limit: number;

  @ApiProperty({ 
    example: 10,
    description: 'จำนวนหน้าทั้งหมด' 
  })
  totalPages: number;
}

export class PaginatedBookResponse {
  @ApiProperty({ 
    type: [BookResponse],
    description: 'รายการหนังสือ' 
  })
  data: BookResponse[];

  @ApiProperty({ 
    type: PaginationMeta,
    description: 'ข้อมูล pagination' 
  })
  meta: PaginationMeta;
}

export class CreateBookResponse {
  @ApiProperty({ 
    example: true,
    description: 'สถานะการทำงาน' 
  })
  success: boolean;

  @ApiProperty({ 
    type: BookResponse,
    description: 'ข้อมูลหนังสือที่สร้าง' 
  })
  data: BookResponse;

  @ApiProperty({ 
    example: 'สร้างหนังสือสำเร็จ',
    description: 'ข้อความแสดงผลการทำงาน' 
  })
  message: string;
}

export class UpdateBookResponse {
  @ApiProperty({ 
    example: true,
    description: 'สถานะการทำงาน' 
  })
  success: boolean;

  @ApiProperty({ 
    type: BookResponse,
    description: 'ข้อมูลหนังสือที่อัพเดท' 
  })
  data: BookResponse;

  @ApiProperty({ 
    example: 'อัพเดทหนังสือสำเร็จ',
    description: 'ข้อความแสดงผลการทำงาน' 
  })
  message: string;
}

export class DeleteBookResponse {
  @ApiProperty({ 
    example: true,
    description: 'สถานะการทำงาน' 
  })
  success: boolean;

  @ApiProperty({ 
    example: 'ลบหนังสือสำเร็จ',
    description: 'ข้อความแสดงผลการทำงาน' 
  })
  message: string;
}

// Query params interface (ใช้ใน code ไม่ได้ใช้กับ Swagger)
export interface BookQueryParams {
  title?: string;
  author?: string;
  page?: number;
  limit?: number;
}