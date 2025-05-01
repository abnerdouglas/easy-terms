import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../user/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('history')
@ApiTags('History')
@ApiBearerAuth()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  async getLogs(
    @Query('entity') entity?: string,
    @Query('entityId') entityId?: string,
  ) {
    return this.historyService.findAll({ entity, entityId });
  }
}
