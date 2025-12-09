import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import configs from './config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BuildingsModule } from './modules/buildings/buildings.module';
import { ChargesModule } from './modules/charges/charges.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { FundModule } from './modules/fund/fund.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { EventsModule } from './modules/events/events.module';
import { ResidentsModule } from './modules/residents/residents.module';
import { UnitsModule } from './modules/units/units.module';
import { DiscussionsModule } from './modules/discussions/discussions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env.local', '.env'],
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{
          ttl: config.get<number>('app.throttle.ttl') || 60,
          limit: config.get<number>('app.throttle.limit') || 100,
        }],
      }),
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    BuildingsModule,
    ChargesModule,
    PaymentsModule,
    ExpensesModule,
    FundModule,
    AnnouncementsModule,
    MaintenanceModule,
    DocumentsModule,
    EventsModule,
    ResidentsModule,
    UnitsModule,
    DiscussionsModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
