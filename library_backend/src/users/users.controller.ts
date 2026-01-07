import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Patch,
  Body,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@UseGuards(AuthGuard('jwt'), RolesGuard) // Tüm kapılarda güvenlik var
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Sadece Adminler tüm kullanıcıları görebilir
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // TEK KULLANICI GETİR (Düzenleme sayfası için)
  @Get(':id')
  @Roles(UserRole.ADMIN)
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  // KULLANICI EKLE
  @Post()
  @Roles(UserRole.ADMIN)
  createUser(@Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.usersService.create(body.email, body.password, body.role);
  }

  // KULLANICI GÜNCELLE
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  updateUser(@Param('id') id: string, @Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.usersService.update(parseInt(id), body);
  }

  // SİL
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
