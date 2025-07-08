-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "published_year" INTEGER,
    "genre" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_books_author" ON "books"("author");

-- CreateIndex
CREATE INDEX "idx_books_genre" ON "books"("genre");

-- CreateIndex
CREATE INDEX "idx_books_title" ON "books"("title");
