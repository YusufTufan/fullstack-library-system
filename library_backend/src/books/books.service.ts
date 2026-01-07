import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Book } from '../entities/book.entity';
import { Category } from '../entities/category.entity';
import { Author } from '../entities/author.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  // --- KİTAP EKLE ---
  async create(createBookDto: CreateBookDto) {
    const { categoryId, authorIds, ...bookData } = createBookDto;

    // 1. Kategoriyi bul
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Kategori bulunamadı!');

    // 2. Yazarları bul
    const authors = await this.authorRepository.findBy({
      id: In(authorIds), // ID'si listede olanları getir
    });

    // 3. Kitabı hazırla
    const newBook = this.bookRepository.create({
      ...bookData,
      category,
      authors,
    });

    // 4. Kaydet
    return await this.bookRepository.save(newBook);
  }

  // --- KİTAP GÜNCELLE (UPDATE) ---
  async update(id: number, updateBookDto: any) {
    // DTO ile uğraşmayalım şimdilik any olsun
    const book = await this.findOne(id); // Önce kitap var mı diye bak (aşağıda yazdık)
    if (!book) throw new NotFoundException('Kitap bulunamadı');

    // Sadece gelen verileri güncelle
    Object.assign(book, updateBookDto);

    return await this.bookRepository.save(book);
  }

  // --- KİTAP SİL (DELETE) ---
  async remove(id: number) {
    const book = await this.findOne(id); // Önce var mı diye bak
    if (!book) throw new NotFoundException('Kitap bulunamadı');

    return await this.bookRepository.remove(book);
  }

  // --- TÜM KİTAPLARI GETİR ---
  async findAll() {
    // Kitapları çekerken 'loans' (ödünç) geçmişini de getiriyoruz
    const books = await this.bookRepository.find({
      relations: ['category', 'authors', 'loans'],
    });

    // Her kitap için "Müsait mi?" (isAvailable) hesabı yapıyoruz
    return books.map((book) => {
      // Eğer iade edilmemiş (isReturned: false) bir kayıt varsa, kitap doludur.
      const isTaken = book.loans.some((loan) => !loan.isReturned);

      return {
        ...book,
        isAvailable: !isTaken, // Dolu değilse müsaittir
        loans: undefined, // Frontend'e gereksiz detay göndermeyelim, temizleyelim
      };
    });
  }

  // (Yardımcı Fonksiyon: ID ile bulma)
  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['category', 'authors'],
    });
    if (!book) throw new NotFoundException('Kitap bulunamadı');
    return book;
  }

  // Tüm Kategorileri Getir
  async getAllCategories() {
    return this.categoryRepository.find();
  }

  // Tüm Yazarları Getir
  async getAllAuthors() {
    return this.authorRepository.find();
  }

  // --- KATEGORİ İŞLEMLERİ ---
  async createCategory(name: string) {
    const newCat = this.categoryRepository.create({ name });
    return await this.categoryRepository.save(newCat);
  }

  async removeCategory(id: number) {
    return await this.categoryRepository.delete(id);
  }

  // --- YAZAR İŞLEMLERİ ---
  async createAuthor(name: string) {
    const newAuthor = this.authorRepository.create({ name });
    return await this.authorRepository.save(newAuthor);
  }

  async removeAuthor(id: number) {
    return await this.authorRepository.delete(id);
  }
}
