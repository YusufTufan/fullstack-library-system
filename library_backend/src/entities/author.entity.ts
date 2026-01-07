import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Book } from './book.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @ManyToMany(() => Book, (book) => book.authors)
  books: Book[];
}
