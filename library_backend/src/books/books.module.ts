import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Category } from '../entities/category.entity';
import { Author } from '../entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Category, Author])],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
