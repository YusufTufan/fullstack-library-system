import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Loan } from './loan.entity';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  //SQLite için type: 'text' yaptık.
  @Column({
    //type: 'enum', enum: UserRole, default: UserRole.MEMBER
    type: 'text',
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  // İLİŞKİ: Bir kullanıcının birden fazla ödünç işlemi olabilir
  @OneToMany(() => Loan, (loan) => loan.user)
  loans: Loan[];
}
