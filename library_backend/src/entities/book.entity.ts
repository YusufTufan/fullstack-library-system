import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Category } from './category.entity';
import { Author } from './author.entity';
import { Loan } from './loan.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  publishYear: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.books, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToMany(() => Author, (author) => author.books, { cascade: true })
  @JoinTable({ name: 'book_authors' })
  authors: Author[];

  @OneToMany(() => Loan, (loan) => loan.book)
  loans: Loan[];
}
