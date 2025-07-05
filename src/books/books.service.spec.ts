import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto';

describe('BooksService', () => {
  let service: BooksService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrismaService = {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      // Arrange
      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'Author 1' },
        { id: 2, title: 'Book 2', author: 'Author 2' },
      ];
      mockPrismaService.book.findMany.mockResolvedValue(mockBooks);
      mockPrismaService.book.count.mockResolvedValue(2);

      // Act
      const result = await service.findAll({ page: 1, limit: 10 });

      // Assert
      expect(result.data).toEqual(mockBooks);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter books by title', async () => {
      // Arrange
      const mockBooks = [
        { id: 1, title: 'Harry Potter', author: 'J.K. Rowling' },
      ];
      mockPrismaService.book.findMany.mockResolvedValue(mockBooks);
      mockPrismaService.book.count.mockResolvedValue(1);

      // Act
      const result = await service.findAll({ title: 'Harry', page: 1, limit: 10 });

      // Assert
      expect(result.data).toEqual(mockBooks);
      expect(mockPrismaService.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: expect.objectContaining({
              contains: 'Harry',
            }),
          }),
        }),
      );
    });

    it('should filter books by author', async () => {
      // Arrange
      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'John Doe' },
      ];
      mockPrismaService.book.findMany.mockResolvedValue(mockBooks);
      mockPrismaService.book.count.mockResolvedValue(1);

      // Act
      const result = await service.findAll({ author: 'John', page: 1, limit: 10 });

      // Assert
      expect(result.data).toEqual(mockBooks);
      expect(mockPrismaService.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            author: expect.objectContaining({
              contains: 'John',
            }),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a book if found', async () => {
      // Arrange
      const mockBook = { id: 1, title: 'Book 1', author: 'Author 1' };
      mockPrismaService.book.findUnique.mockResolvedValue(mockBook);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(mockBook);
      expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if book not found', async () => {
      // Arrange
      mockPrismaService.book.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      // Arrange
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        author: 'New Author',
        published_year: 2024,
        genre: 'Fiction',
      };

      const mockCreatedBook = {
        id: 1,
        ...createBookDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.book.create.mockResolvedValue(mockCreatedBook);

      // Act
      const result = await service.create(createBookDto);

      // Assert
      expect(result).toEqual({
        success: true,
        message: 'สร้างหนังสือสำเร็จ',
        data: mockCreatedBook,
      });
      expect(mockPrismaService.book.create).toHaveBeenCalledWith({
        data: createBookDto,
      });
    });

    it('should throw BadRequestException if published_year is invalid', async () => {
      // Arrange
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        author: 'New Author',
        published_year: 3000, // Invalid year
        genre: 'Fiction',
      };

      // Act & Assert
      await expect(service.create(createBookDto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.book.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a book if exists', async () => {
      // Arrange
      const id = 1;
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        author: 'Updated Author',
      };

      const mockExistingBook = {
        id,
        title: 'Old Book',
        author: 'Old Author',
        published_year: 2024,
        genre: 'Fiction',
      };

      const mockUpdatedBook = {
        ...mockExistingBook,
        ...updateBookDto,
        updated_at: new Date(),
      };

      mockPrismaService.book.findUnique.mockResolvedValue(mockExistingBook);
      mockPrismaService.book.update.mockResolvedValue(mockUpdatedBook);

      // Act
      const result = await service.update(id, updateBookDto);

      // Assert
      expect(result).toEqual({
        success: true,
        message: 'อัพเดทหนังสือสำเร็จ',
        data: mockUpdatedBook,
      });
      expect(mockPrismaService.book.update).toHaveBeenCalledWith({
        where: { id },
        data: updateBookDto,
      });
    });

    it('should throw NotFoundException if book not found', async () => {
      // Arrange
      const id = 999;
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
      };

      mockPrismaService.book.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(id, updateBookDto)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.book.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if published_year is invalid', async () => {
      // Arrange
      const id = 1;
      const updateBookDto: UpdateBookDto = {
        published_year: 3000, // Invalid year
      };

      const mockExistingBook = {
        id,
        title: 'Old Book',
        author: 'Old Author',
        published_year: 2024,
        genre: 'Fiction',
      };

      mockPrismaService.book.findUnique.mockResolvedValue(mockExistingBook);

      // Act & Assert
      await expect(service.update(id, updateBookDto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.book.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a book if exists', async () => {
      // Arrange
      const id = 1;
      const mockBook = {
        id,
        title: 'Book to Delete',
        author: 'Author',
      };

      mockPrismaService.book.findUnique.mockResolvedValue(mockBook);
      mockPrismaService.book.delete.mockResolvedValue(mockBook);

      // Act
      const result = await service.remove(id);

      // Assert
      expect(result).toEqual({
        success: true,
        message: 'ลบหนังสือสำเร็จ',
      });
      expect(mockPrismaService.book.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException if book not found', async () => {
      // Arrange
      const id = 999;
      mockPrismaService.book.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.book.delete).not.toHaveBeenCalled();
    });
  });
});