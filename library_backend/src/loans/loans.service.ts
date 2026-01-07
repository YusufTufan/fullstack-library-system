import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '../entities/loan.entity';
import { Book } from '../entities/book.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  // --- KİTAP ÖDÜNÇ AL ---
  async create(userId: number, bookId: number) {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Kitap bulunamadı.');

    const activeLoan = await this.loanRepository.findOne({
      where: { book: { id: bookId }, isReturned: false },
    });

    if (activeLoan) {
      throw new BadRequestException(
        'Bu kitap şu an başkasında, ödünç alamazsınız.',
      );
    }

    // ÇÖZÜM BURADA: 'any' kullanmak yerine gerçek bir User nesnesi taslağı oluşturuyoruz.
    // Bu sayede ESLint "Unsafe assignment" hatası vermiyor.
    const user = new User();
    user.id = userId;

    const loan = this.loanRepository.create({
      book,
      user, // Artık 'any' değil, gerçek tipte bir veri
      loanDate: new Date(),
      isReturned: false,
    });

    return await this.loanRepository.save(loan);
  }

  // --- KİTAP İADE ET ---
  async returnBook(loanId: number) {
    const loan = await this.loanRepository.findOne({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Kayıt bulunamadı.');

    if (loan.isReturned) {
      throw new BadRequestException('Bu kitap zaten iade edilmiş.');
    }

    loan.isReturned = true;

    loan.returnDate = new Date();

    return await this.loanRepository.save(loan);
  }

  // --- ÖDÜNÇ LİSTESİ ---
  async findAll() {
    return await this.loanRepository.find({
      relations: ['book', 'user'],
    });
  }

  async findUserLoans(userId: number) {
    return await this.loanRepository.find({
      where: { user: { id: userId } },
      relations: ['book'], // Kitap detaylarını da getir
      order: { isReturned: 'ASC', loanDate: 'DESC' }, // Önce iade edilmeyenler, sonra en yeniler
    });
  }
}
