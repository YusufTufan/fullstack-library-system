import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities/user.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  // --- GÜNCELLEME (UPDATE) ---
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Sadece Giriş Yapanlar
  @Roles(UserRole.ADMIN) // Sadece Adminler
  update(@Param('id') id: string, @Body() updateBookDto: any) {
    return this.booksService.update(+id, updateBookDto);
  }

  // --- SİLME (DELETE) ---
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Sadece Giriş Yapanlar
  @Roles(UserRole.ADMIN) // Sadece Adminler
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  // URL: http://localhost:3000/books/categories
  @Get('categories')
  getAllCategories() {
    return this.booksService.getAllCategories();
  }

  // URL: http://localhost:3000/books/authors
  @Get('authors')
  getAllAuthors() {
    return this.booksService.getAllAuthors();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  // --- KATEGORİ YÖNETİMİ ---
  @Post('categories')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  createCategory(@Body() body: { name: string }) {
    return this.booksService.createCategory(body.name);
  }

  @Delete('categories/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  removeCategory(@Param('id') id: string) {
    return this.booksService.removeCategory(+id);
  }

  // --- YAZAR YÖNETİMİ ---
  @Post('authors')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  createAuthor(@Body() body: { name: string }) {
    return this.booksService.createAuthor(body.name);
  }

  @Delete('authors/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  removeAuthor(@Param('id') id: string) {
    return this.booksService.removeAuthor(+id);
  }
}
