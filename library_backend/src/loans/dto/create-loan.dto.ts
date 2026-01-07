import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLoanDto {
  @IsNotEmpty()
  @IsNumber()
  bookId: number;
}
