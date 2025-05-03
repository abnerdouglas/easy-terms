import { Controller, Get, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../user/enums/role.enum';
import { ListHistoryLogDTO } from './dto/list-history.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('history')
@ApiTags('History')
@ApiBearerAuth()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) { }

  @Get()
  @ApiOperation({ summary: "Busca o historico relacionado aos usuários e termos" })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getLogs(@Query() query?: ListHistoryLogDTO) {
    return this.historyService.findAll(query);
  }
}
