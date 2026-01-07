import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity'; // User entity'nin yeri
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // --- KAYIT OL (REGISTER) ---
  async register(registerDto: RegisterDto) {
    const { email, password, role } = registerDto;

    // 1. Bu mail adresi zaten var mı?
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Bu email adresi zaten kullanılıyor!');
    }

    // 2. Şifreyi şifrele (Hash) - "12345" yerine "xy98.23..." kaydedeceğiz
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Kullanıcıyı oluştur
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role: role || UserRole.MEMBER, // Eğer rol gelmezse varsayılan 'member' olsun
    });

    await this.usersRepository.save(user);
    return { message: 'Kullanıcı başarıyla oluşturuldu.' };
  }

  // --- GİRİŞ YAP (LOGIN) ---
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Kullanıcıyı bul
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email veya şifre hatalı.');
    }

    // 2. Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email veya şifre hatalı.');
    }

    // 3. KİMLİK KARTINI (Token) BAS
    // Token'ın içine ID'sini ve ROLÜNÜ gizliyoruz.
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user, // Frontend'e rolünü de gönderiyoruz ki sayfayı ona göre açsın
    };
  }
}
