import { Module } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { ResidentsController } from './residents.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [ResidentsService, PrismaService],
  controllers: [ResidentsController],
  exports: [ResidentsService],
})
export class ResidentsModule {}
