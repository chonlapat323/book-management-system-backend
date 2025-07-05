import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto, QueryBookDto, UpdateBookDto } from './dto';
import {
  BookResponse,
  CreateBookResponse,
  DeleteBookResponse,
  PaginatedBookResponse,
  UpdateBookResponse
} from './types';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  private validatePublishedYear(year: number) {
    const currentYear = new Date().getFullYear();
    if (year > currentYear) {
      throw new BadRequestException('ปีที่พิมพ์ต้องไม่เกินปีปัจจุบัน');
    }
  }

  async findAll(query: QueryBookDto): Promise<PaginatedBookResponse> {
    const { page = 1, limit = 10, title, author } = query;
    const skip = (page - 1) * limit;

    // สร้าง where condition สำหรับ filter
    const where: Prisma.BookWhereInput = {
      ...(title && {
        title: {
          contains: title,
          mode: 'insensitive' as Prisma.QueryMode
        }
      }),
      ...(author && {
        author: {
          contains: author,
          mode: 'insensitive' as Prisma.QueryMode
        }
      })
    };

    // หาจำนวนทั้งหมดและข้อมูลพร้อมกัน
    const [total, books] = await Promise.all([
      this.prisma.book.count({ where }),
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc'
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: books,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  async findOne(id: number): Promise<BookResponse> {
    const book = await this.prisma.book.findUnique({
      where: { id }
    });

    if (!book) {
      throw new NotFoundException(`ไม่พบหนังสือรหัส ${id}`);
    }

    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<CreateBookResponse> {
    try {
      // Validate published_year
      if (createBookDto.published_year) {
        this.validatePublishedYear(createBookDto.published_year);
      }

      const book = await this.prisma.book.create({
        data: createBookDto
      });

      return {
        success: true,
        data: book,
        message: 'สร้างหนังสือสำเร็จ'
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error('ไม่สามารถสร้างหนังสือได้ กรุณาลองใหม่อีกครั้ง');
      }
      throw error;
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<UpdateBookResponse> {
    try {
      // ตรวจสอบว่ามีหนังสือที่ต้องการอัพเดทหรือไม่
      await this.findOne(id);

      // Validate published_year
      if (updateBookDto.published_year) {
        this.validatePublishedYear(updateBookDto.published_year);
      }

      const book = await this.prisma.book.update({
        where: { id },
        data: updateBookDto
      });

      return {
        success: true,
        data: book,
        message: 'อัพเดทหนังสือสำเร็จ'
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error('ไม่สามารถอัพเดทหนังสือได้ กรุณาลองใหม่อีกครั้ง');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<DeleteBookResponse> {
    try {
      // ตรวจสอบว่ามีหนังสือที่ต้องการลบหรือไม่
      await this.findOne(id);

      await this.prisma.book.delete({
        where: { id }
      });

      return {
        success: true,
        message: 'ลบหนังสือสำเร็จ'
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error('ไม่สามารถลบหนังสือได้ กรุณาลองใหม่อีกครั้ง');
      }
      throw error;
    }
  }
}