import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Token'ı başlıktan al
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, // Gizli kelimemizle kontrol et
    });
  }

  validate(payload: JwtPayload) {
    // Token geçerliyse içindeki bilgileri (id, email, role) geri döndür
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
