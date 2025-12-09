import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { SendOtpDto, VerifyOtpDto, RegisterDto } from './dto';
import { JwtPayload, TokenPair } from './interfaces/jwt-payload.interface';
import { MESSAGES } from '../../common/constants/messages.constants';
import { normalizePhone } from '../../common/utils/phone.utils';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate and send OTP to phone number
   */
  async sendOtp(dto: SendOtpDto) {
    const phone = normalizePhone(dto.phone);
    
    // Check for existing unexpired OTP
    const existingOtp = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingOtp) {
      const cooldown = this.configService.get<number>('jwt.otp.cooldown') || 60;
      const timeSinceCreation = (Date.now() - existingOtp.createdAt.getTime()) / 1000;
      
      if (timeSinceCreation < cooldown) {
        const remainingTime = Math.ceil(cooldown - timeSinceCreation);
        throw new BadRequestException(
          MESSAGES.AUTH.OTP_COOLDOWN.replace('{seconds}', String(remainingTime))
        );
      }
    }

    // Generate 6-digit OTP
    const code = this.generateOtp();
    const expirySeconds = this.configService.get<number>('jwt.otp.expiry') || 120;

    // Save OTP to database
    await this.prisma.otpCode.create({
      data: {
        phone,
        code,
        purpose: 'login',
        expiresAt: new Date(Date.now() + expirySeconds * 1000),
      },
    });

    // TODO: Send OTP via SMS (integrate with Kavenegar)
    // For now, log it in development
    if (this.configService.get('app.nodeEnv') === 'development') {
      console.log(`📱 OTP for ${phone}: ${code}`);
    }

    return {
      success: true,
      message: MESSAGES.AUTH.OTP_SENT,
      expiresIn: expirySeconds,
      // Only include code in development for testing
      ...(this.configService.get('app.nodeEnv') === 'development' && { code }),
    };
  }

  /**
   * Verify OTP and return tokens or indicate new user
   */
  async verifyOtp(dto: VerifyOtpDto) {
    const phone = normalizePhone(dto.phone);

    // Find valid OTP
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        code: dto.code,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      // Check if OTP exists but expired
      const expiredOtp = await this.prisma.otpCode.findFirst({
        where: { phone, code: dto.code },
        orderBy: { createdAt: 'desc' },
      });

      if (expiredOtp && expiredOtp.expiresAt < new Date()) {
        throw new UnauthorizedException(MESSAGES.AUTH.OTP_EXPIRED);
      }

      throw new UnauthorizedException(MESSAGES.AUTH.OTP_INVALID);
    }

    // Check max attempts
    const maxAttempts = this.configService.get<number>('jwt.otp.maxAttempts') || 3;
    if (otpRecord.attempts >= maxAttempts) {
      throw new UnauthorizedException(MESSAGES.AUTH.OTP_TOO_MANY_ATTEMPTS);
    }

    // Mark OTP as used
    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { usedAt: new Date() },
    });

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
      include: {
        buildingMembers: {
          where: { isActive: true },
          include: {
            building: true,
            unit: true,
          },
        },
      },
    });

    if (!existingUser) {
      // New user - return indication for registration
      return {
        isNewUser: true,
        phone,
      };
    }

    // Existing user - generate tokens and return
    const tokens = await this.generateTokens(existingUser);

    // Update last login
    await this.prisma.user.update({
      where: { id: existingUser.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session
    await this.createSession(existingUser.id, tokens.refreshToken);

    return {
      isNewUser: false,
      auth: {
        ...tokens,
        user: this.formatUserResponse(existingUser),
        buildings: this.formatBuildingsResponse(existingUser.buildingMembers),
      },
    };
  }

  /**
   * Register a new user
   */
  async register(dto: RegisterDto) {
    const phone = normalizePhone(dto.phone);

    // Verify OTP first
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        code: dto.code,
        usedAt: { not: null },
        createdAt: { gt: new Date(Date.now() - 10 * 60 * 1000) }, // Within last 10 minutes
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new UnauthorizedException(MESSAGES.AUTH.OTP_INVALID);
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new ConflictException(MESSAGES.AUTH.PHONE_ALREADY_EXISTS);
    }

    // Check email uniqueness if provided
    if (dto.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (emailExists) {
        throw new ConflictException(MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
      }
    }

    // Create user
    const user = await this.prisma.user.create({
      data: {
        phone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        nationalId: dto.nationalId,
        status: 'ACTIVE',
      },
      include: {
        buildingMembers: {
          where: { isActive: true },
          include: {
            building: true,
            unit: true,
          },
        },
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.createSession(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: this.formatUserResponse(user),
      buildings: [],
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException(MESSAGES.AUTH.TOKEN_INVALID);
      }

      // Check if session exists
      const session = await this.prisma.session.findUnique({
        where: { refreshToken },
        include: {
          user: {
            include: {
              buildingMembers: {
                where: { isActive: true },
                include: {
                  building: true,
                  unit: true,
                },
              },
            },
          },
        },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException(MESSAGES.AUTH.TOKEN_EXPIRED);
      }

      const user = session.user;

      if (user.status !== 'ACTIVE') {
        throw new UnauthorizedException(MESSAGES.AUTH.USER_INACTIVE);
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Update session with new refresh token
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        ...tokens,
        user: this.formatUserResponse(user),
        buildings: this.formatBuildingsResponse(user.buildingMembers),
      };
    } catch (error) {
      throw new UnauthorizedException(MESSAGES.AUTH.TOKEN_INVALID);
    }
  }

  /**
   * Logout - invalidate session
   */
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.session.deleteMany({
        where: { userId, refreshToken },
      });
    } else {
      // Logout from all sessions
      await this.prisma.session.deleteMany({
        where: { userId },
      });
    }

    return { message: MESSAGES.AUTH.LOGOUT_SUCCESS };
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        buildingMembers: {
          where: { isActive: true },
          include: {
            building: true,
            unit: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    return {
      user: this.formatUserResponse(user),
      buildings: this.formatBuildingsResponse(user.buildingMembers),
    };
  }

  // ==================== Private Methods ====================

  private generateOtp(): string {
    const length = this.configService.get<number>('jwt.otp.length') || 6;
    return Math.random().toString().slice(2, 2 + length).padStart(length, '0');
  }

  private async generateTokens(user: any): Promise<TokenPair> {
    const accessPayload: JwtPayload = {
      sub: user.id,
      phone: user.phone,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: user.id,
      phone: user.phone,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        expiresIn: this.configService.get<string>('jwt.accessTokenExpiry') || '15m',
      } as any),
      this.jwtService.signAsync(refreshPayload, {
        expiresIn: this.configService.get<string>('jwt.refreshTokenExpiry') || '7d',
      } as any),
    ]);

    return { accessToken, refreshToken };
  }

  private async createSession(userId: string, refreshToken: string, userAgent?: string, ipAddress?: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });
  }

  private formatUserResponse(user: any) {
    return {
      id: user.id,
      phone: user.phone,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      status: user.status,
    };
  }

  private formatBuildingsResponse(memberships: any[]) {
    return memberships.map((m) => ({
      buildingId: m.building.id,
      buildingName: m.building.name,
      role: m.role,
      unitNumber: m.unit?.number,
    }));
  }
}
