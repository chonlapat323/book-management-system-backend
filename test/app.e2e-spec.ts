import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    // Setup global pipes same as main.ts
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }));

    // Set global prefix same as main.ts
    app.setGlobalPrefix('api');

    await app.init();
  });

  beforeEach(async () => {
    // Clear test database before each test
    await prisma.book.deleteMany();
  });

  describe('/books (GET)', () => {
    it('should return empty array when no books', () => {
      return request(app.getHttpServer())
        .get('/api/books')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
          expect(res.body.meta.total).toBe(0);
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(10);
          expect(res.body.meta.totalPages).toBe(0);
        });
    });

    it('should return paginated books', async () => {
      // Create test books
      await prisma.book.createMany({
        data: [
          { title: 'Book 1', author: 'Author 1' },
          { title: 'Book 2', author: 'Author 2' },
          { title: 'Book 3', author: 'Author 3' },
        ],
      });

      return request(app.getHttpServer())
        .get('/api/books')
        .query({ page: 1, limit: 2 })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toHaveLength(2);
          expect(res.body.meta.total).toBe(3);
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(2);
          expect(res.body.meta.totalPages).toBe(2);
        });
    });

    it('should filter books by title', async () => {
      await prisma.book.createMany({
        data: [
          { title: 'Harry Potter', author: 'Author 1' },
          { title: 'Lord of the Rings', author: 'Author 2' },
        ],
      });

      return request(app.getHttpServer())
        .get('/api/books')
        .query({ title: 'Harry' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0].title).toBe('Harry Potter');
        });
    });
  });

  describe('/books/:id (GET)', () => {
    it('should return a book if exists', async () => {
      const book = await prisma.book.create({
        data: {
          title: 'Test Book',
          author: 'Test Author',
          published_year: 2020,
          genre: 'Fiction'
        }
      });

      return request(app.getHttpServer())
        .get(`/api/books/${book.id}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.id).toBe(book.id);
          expect(res.body.title).toBe(book.title);
          expect(res.body.author).toBe(book.author);
          expect(res.body.published_year).toBe(book.published_year);
          expect(res.body.genre).toBe(book.genre);
        });
    });

    it('should return 404 if book not found', () => {
      return request(app.getHttpServer())
        .get('/api/books/999')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 400 if id is not a number', () => {
      return request(app.getHttpServer())
        .get('/api/books/abc')
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/books (POST)', () => {
    it('should create a new book', () => {
      const newBook = {
        title: 'New Book',
        author: 'New Author',
        published_year: 2023,
        genre: 'Fiction'
      };

      return request(app.getHttpServer())
        .post('/api/books')
        .send(newBook)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.title).toBe(newBook.title);
          expect(res.body.data.author).toBe(newBook.author);
          expect(res.body.data.published_year).toBe(newBook.published_year);
          expect(res.body.data.genre).toBe(newBook.genre);
          expect(res.body.message).toBe('สร้างหนังสือสำเร็จ');
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/api/books')
        .send({
          // Missing required fields
          published_year: 2023,
          genre: 'Fiction'
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should validate published_year range', () => {
      return request(app.getHttpServer())
        .post('/api/books')
        .send({
          title: 'Test Book',
          author: 'Test Author',
          published_year: 3000, // Invalid year
          genre: 'Fiction'
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/books/:id (PUT)', () => {
    it('should update a book if exists', async () => {
      const book = await prisma.book.create({
        data: {
          title: 'Old Title',
          author: 'Old Author',
          published_year: 2020,
          genre: 'Fiction'
        }
      });

      const updateData = {
        title: 'Updated Title',
        author: 'Updated Author',
        published_year: 2021,
        genre: 'Non-Fiction'
      };

      return request(app.getHttpServer())
        .put(`/api/books/${book.id}`)
        .send(updateData)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.title).toBe(updateData.title);
          expect(res.body.data.author).toBe(updateData.author);
          expect(res.body.data.published_year).toBe(updateData.published_year);
          expect(res.body.data.genre).toBe(updateData.genre);
          expect(res.body.message).toBe('อัพเดทหนังสือสำเร็จ');
        });
    });

    it('should return 404 if book not found', () => {
      return request(app.getHttpServer())
        .put('/api/books/999')
        .send({
          title: 'Updated Title',
          author: 'Updated Author'
        })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should validate request body', () => {
      return request(app.getHttpServer())
        .put('/api/books/1')
        .send({
          published_year: 'invalid year'
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/books/:id (DELETE)', () => {
    it('should delete a book if exists', async () => {
      const book = await prisma.book.create({
        data: {
          title: 'Book to Delete',
          author: 'Author',
          published_year: 2020,
          genre: 'Fiction'
        }
      });

      return request(app.getHttpServer())
        .delete(`/api/books/${book.id}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('ลบหนังสือสำเร็จ');
        });
    });

    it('should return 404 if book not found', () => {
      return request(app.getHttpServer())
        .delete('/api/books/999')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 400 if id is not a number', () => {
      return request(app.getHttpServer())
        .delete('/api/books/abc')
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});