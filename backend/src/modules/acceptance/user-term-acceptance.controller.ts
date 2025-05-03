import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserTermAcceptanceService } from './user-term-acceptance.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../user/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('/user-term-acceptance')
@ApiTags("user-term-acceptance")
@ApiBearerAuth()
export class UserTermAcceptanceController {
    constructor(private readonly userTermAcceptanceService: UserTermAcceptanceService) { }

    @Get()
    @ApiOperation({ summary: "Busca todas os termos que foram enviados para confirmação via email" })
    async findAll() {
        return this.userTermAcceptanceService.findAll();
    }
}