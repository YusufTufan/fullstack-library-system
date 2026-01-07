import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Kapıdaki etiketi oku
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Etiket yoksa herkes girebilir
    if (!requiredRoles) {
      return true;
    }

    // --- HATA ÇÖZÜMÜ BURADA ---
    // 'any' kullanmak yerine, getRequest fonksiyonuna "Bana şu tipte bir şey döneceksin" diyoruz.
    // Bu sayede ESLint "Hah tamam, tipini biliyorsun" deyip susuyor.
    const request = context
      .switchToHttp()
      .getRequest<{ user: { role: UserRole } }>();

    const user = request.user;

    // 2. Kullanıcı yoksa veya rolü yoksa içeri alma
    if (!user || !user.role) {
      return false;
    }

    // 3. Kontrol et (includes kullanarak daha temiz yazdık)
    return requiredRoles.includes(user.role);
  }
}
