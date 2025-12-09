import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ResidentsService } from './residents.service';
import { ResidentQueryDto, ResidentResponseDto } from './dto/resident-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentBuilding } from '../../common/decorators/current-building.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constants';

@ApiTags('Residents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MANAGER, UserRole.SUPER_ADMIN)
@Controller('residents')
export class ResidentsController {
  constructor(private residentsService: ResidentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all residents in building' })
  @ApiResponse({
    status: 200,
    description: 'Residents retrieved',
  })
  async findAll(
    @Query() query: ResidentQueryDto,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.residentsService.findAllByBuilding(buildingId, query);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get residents statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved',
  })
  async getStatistics(@CurrentBuilding() buildingId: string) {
    return this.residentsService.getStatistics(buildingId);
  }

  @Get(':userId')
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiOperation({ summary: 'Get resident details' })
  @ApiResponse({
    status: 200,
    description: 'Resident retrieved',
    type: ResidentResponseDto,
  })
  async findOne(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.residentsService.findOne(buildingId, userId);
  }
}
