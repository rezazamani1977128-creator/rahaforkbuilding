import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [UnitsService, PrismaService],
  controllers: [UnitsController],
  exports: [UnitsService],
})
export class UnitsModule {}
