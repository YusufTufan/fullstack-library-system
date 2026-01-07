import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  role?: UserRole; // 'admin' veya 'member' olabilir
}
