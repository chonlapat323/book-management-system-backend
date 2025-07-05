-- สร้าง database และ user (ถ้าต้องการ)
-- CREATE DATABASE book_management;
-- CREATE USER book_user WITH PASSWORD 'book_password';
-- GRANT ALL PRIVILEGES ON DATABASE book_management TO book_user;

-- สร้างตาราง books ตามโจทย์
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  published_year INT,
  genre VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- สร้าง index สำหรับการค้นหา
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);

-- เพิ่มข้อมูลตัวอย่าง (Optional)
INSERT INTO books (title, author, published_year, genre) VALUES
  ('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Fiction'),
  ('To Kill a Mockingbird', 'Harper Lee', 1960, 'Fiction'),
  ('1984', 'George Orwell', 1949, 'Dystopian'),
  ('Pride and Prejudice', 'Jane Austen', 1813, 'Romance'),
  ('The Hobbit', 'J.R.R. Tolkien', 1937, 'Fantasy')
ON CONFLICT DO NOTHING;