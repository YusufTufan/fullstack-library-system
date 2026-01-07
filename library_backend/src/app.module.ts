import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { Category } from './entities/category.entity';
import { Author } from './entities/author.entity';
import { Loan } from './entities/loan.entity';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'library.db',
      entities: [User, Book, Category, Author, Loan],
      synchronize: true,
    }),
    AuthModule,
    BooksModule,
    UsersModule,
    LoansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
