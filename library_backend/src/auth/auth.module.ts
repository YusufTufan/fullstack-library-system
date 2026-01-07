import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // User tablosunu kullanacağız
    JwtModule.register({
      global: true, // Tüm projede geçerli olsun
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' }, // Token süresi (6000 saniye)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
