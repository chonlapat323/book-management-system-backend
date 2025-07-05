import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto, QueryBookDto, UpdateBookDto } from './dto';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const query: QueryBookDto = { page: 1, limit: 10 };
      const expectedResult = {
        data: [
          { id: 1, title: 'Book 1', author: 'Author 1' },
          { id: 2, title: 'Book 2', author: 'Author 2' },
        ],
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockBooksService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);
      expect(result).toEqual(expectedResult);
      expect(mockBooksService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const id = 1;
      const expectedBook = { id, title: 'Book 1', author: 'Author 1' };

      mockBooksService.findOne.mockResolvedValue(expectedBook);

      const result = await controller.findOne(id);
      expect(result).toEqual(expectedBook);
      expect(mockBooksService.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when book not found', async () => {
      const id = 999;
      mockBooksService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        author: 'New Author',
        published_year: 2024,
        genre: 'Fiction',
      };

      const expectedResult = {
        success: true,
        message: 'สร้างหนังสือสำเร็จ',
        data: { id: 1, ...createBookDto },
      };

      mockBooksService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createBookDto);
      expect(result).toEqual(expectedResult);
      expect(mockBooksService.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const id = 1;
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        author: 'Updated Author',
      };

      const expectedResult = {
        success: true,
        message: 'อัพเดทหนังสือสำเร็จ',
        data: { id, ...updateBookDto },
      };

      mockBooksService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateBookDto);
      expect(result).toEqual(expectedResult);
      expect(mockBooksService.update).toHaveBeenCalledWith(id, updateBookDto);
    });

    it('should throw NotFoundException when updating non-existent book', async () => {
      const id = 999;
      const updateBookDto: UpdateBookDto = { title: 'Updated Book' };

      mockBooksService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(id, updateBookDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      const id = 1;
      const expectedResult = {
        success: true,
        message: 'ลบหนังสือสำเร็จ',
      };

      mockBooksService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);
      expect(result).toEqual(expectedResult);
      expect(mockBooksService.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when deleting non-existent book', async () => {
      const id = 999;
      mockBooksService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
