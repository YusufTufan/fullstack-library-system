import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.loans)
  user: User;

  @ManyToOne(() => Book, (book) => book.loans)
  book: Book;

  @CreateDateColumn()
  loanDate: Date;

  @Column({ default: false })
  isReturned: boolean;
  returnDate: Date;
}
