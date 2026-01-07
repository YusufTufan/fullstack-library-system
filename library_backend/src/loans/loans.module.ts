import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan } from '../entities/loan.entity';
import { Book } from '../entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Book])],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
