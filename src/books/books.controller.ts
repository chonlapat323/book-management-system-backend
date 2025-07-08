import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { routeThrottlers } from '../common/config/throttler.config';
import { BooksService } from './books.service';
import { CreateBookDto, QueryBookDto, UpdateBookDto } from './dto';
import {
  BookResponse,
  CreateBookResponse,
  DeleteBookResponse,
  PaginatedBookResponse,
  UpdateBookResponse
} from './types';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all books',
    description: 'ดึงรายการหนังสือทั้งหมด พร้อม pagination และ filters' 
  })
  @ApiQuery({ 
    name: 'title', 
    required: false, 
    description: 'ค้นหาจากชื่อหนังสือ' 
  })
  @ApiQuery({ 
    name: 'author', 
    required: false, 
    description: 'ค้นหาจากชื่อผู้แต่ง' 
  })
  @ApiQuery({ 
    name: 'genre', 
    required: false, 
    description: 'ค้นหาจากประเภทหนังสือ' 
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'หน้าที่ต้องการ (เริ่มจาก 1)', 
    type: Number 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'จำนวนรายการต่อหน้า', 
    type: Number 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'ดึงรายการหนังสือสำเร็จ',
    type: PaginatedBookResponse 
  })
  @ApiBadRequestResponse({ 
    description: 'รูปแบบข้อมูลไม่ถูกต้อง เช่น page หรือ limit ไม่ใช่ตัวเลข' 
  })
  @Throttle({ default: { ttl: routeThrottlers.frequent.ttl, limit: routeThrottlers.frequent.limit } })
  async findAll(@Query() query: QueryBookDto): Promise<PaginatedBookResponse> {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a book by ID',
    description: 'ดึงข้อมูลหนังสือตาม ID' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'รหัสหนังสือ',
    type: Number 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'ดึงข้อมูลหนังสือสำเร็จ',
    type: BookResponse 
  })
  @ApiNotFoundResponse({ 
    description: 'ไม่พบหนังสือที่ต้องการ' 
  })
  @ApiBadRequestResponse({ 
    description: 'รหัสหนังสือไม่ถูกต้อง' 
  })
  @Throttle({ default: { ttl: routeThrottlers.frequent.ttl, limit: routeThrottlers.frequent.limit } })
  async findOne(
    @Param('id', new ParseIntPipe({ 
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: () => new BadRequestException('รหัสหนังสือต้องเป็นตัวเลขเท่านั้น')
    })) 
    id: number
  ): Promise<BookResponse> {
    return this.booksService.findOne(id);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Create a new book',
    description: 'สร้างหนังสือใหม่' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'สร้างหนังสือสำเร็จ',
    type: CreateBookResponse 
  })
  @ApiBadRequestResponse({ 
    description: 'ข้อมูลไม่ถูกต้อง หรือไม่ครบถ้วน' 
  })
  @ApiResponse({ 
    status: 429, 
    description: 'คุณส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง' 
  })
  @Throttle({ default: { ttl: routeThrottlers.secure.ttl, limit: routeThrottlers.secure.limit } })
  async create(@Body() createBookDto: CreateBookDto): Promise<CreateBookResponse> {
    return this.booksService.create(createBookDto);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a book',
    description: 'อัพเดทข้อมูลหนังสือ' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'รหัสหนังสือที่ต้องการอัพเดท',
    type: Number 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'อัพเดทหนังสือสำเร็จ',
    type: UpdateBookResponse 
  })
  @ApiNotFoundResponse({ 
    description: 'ไม่พบหนังสือที่ต้องการอัพเดท' 
  })
  @ApiBadRequestResponse({ 
    description: 'รหัสหนังสือหรือข้อมูลไม่ถูกต้อง' 
  })
  @Throttle({ default: { ttl: routeThrottlers.secure.ttl, limit: routeThrottlers.secure.limit } })
  async update(
    @Param('id', new ParseIntPipe({ 
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: () => new BadRequestException('รหัสหนังสือต้องเป็นตัวเลขเท่านั้น')
    })) 
    id: number,
    @Body() updateBookDto: UpdateBookDto
  ): Promise<UpdateBookResponse> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a book',
    description: 'ลบหนังสือ' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'รหัสหนังสือที่ต้องการลบ',
    type: Number 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'ลบหนังสือสำเร็จ',
    type: DeleteBookResponse 
  })
  @ApiNotFoundResponse({ 
    description: 'ไม่พบหนังสือที่ต้องการลบ' 
  })
  @ApiBadRequestResponse({ 
    description: 'รหัสหนังสือไม่ถูกต้อง' 
  })
  @Throttle({ default: { ttl: routeThrottlers.secure.ttl, limit: routeThrottlers.secure.limit } })
  async remove(
    @Param('id', new ParseIntPipe({ 
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: () => new BadRequestException('รหัสหนังสือต้องเป็นตัวเลขเท่านั้น')
    })) 
    id: number
  ): Promise<DeleteBookResponse> {
    return this.booksService.remove(id);
  }
}