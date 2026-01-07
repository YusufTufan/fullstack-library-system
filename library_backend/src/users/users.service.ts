import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. Tüm Kullanıcıları Listele (Şifreleri gizleyerek)
  async findAll() {
    return await this.usersRepository.find({
      select: ['id', 'email', 'role', 'createdAt'], // Şifre hariç getir
    });
  }

  // 2. Tek Kullanıcı Bul
  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'role', 'createdAt'],
    });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
    return user;
  }

  async create(email: string, password: string, role: any) {
    // Şifreyi hash'le (güvenlik)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      role: role,
    });
    return this.usersRepository.save(user);
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
    return this.usersRepository.remove(user);
  }
}
