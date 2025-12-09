import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { MESSAGES } from '../../../common/constants/messages.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'default-secret',
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException(MESSAGES.AUTH.TOKEN_INVALID);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        phone: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        status: true,
        isSuperAdmin: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    if (user.status !== 'ACTIVE') {
      if (user.status === 'SUSPENDED') {
        throw new UnauthorizedException(MESSAGES.AUTH.USER_SUSPENDED);
      }
      throw new UnauthorizedException(MESSAGES.AUTH.USER_INACTIVE);
    }

    return {
      ...user,
      buildingId: payload.buildingId,
      role: payload.role,
    };
  }
}
