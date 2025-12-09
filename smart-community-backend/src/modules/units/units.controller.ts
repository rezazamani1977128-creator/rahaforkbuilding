import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UnitsService } from './units.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentBuilding } from '../../common/decorators/current-building.decorator';

@ApiTags('Units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('units')
export class UnitsController {
  constructor(private unitsService: UnitsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all units' })
  async findAll(
    @CurrentBuilding() buildingId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.unitsService.findAll(buildingId, page, limit);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get unit statistics' })
  async getStatistics(@CurrentBuilding() buildingId: string) {
    return this.unitsService.getStatistics(buildingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get unit details' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) unitId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.unitsService.findOne(buildingId, unitId);
  }
}
