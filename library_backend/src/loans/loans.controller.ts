import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

// ÇÖZÜM 1: Request'in içini tanımlıyoruz
interface RequestWithUser {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  // ÇÖZÜM 2: @Request() yanına kendi tipimizi yazdık
  create(
    @Request() req: RequestWithUser,
    @Body() createLoanDto: CreateLoanDto,
  ) {
    return this.loansService.create(req.user.userId, createLoanDto.bookId);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/return')
  returnBook(@Param('id') id: string) {
    return this.loansService.returnBook(+id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.loansService.findAll();
  }

  @Get('my-loans')
  getMyLoans(@Request() req: RequestWithUser) {
    return this.loansService.findUserLoans(req.user.userId);
  }
}
