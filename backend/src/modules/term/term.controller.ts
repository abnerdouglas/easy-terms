import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TermService } from "./term.service";
import { ListTermsDTO } from "./dto/list-term.dto";
import { CreateTermDTO } from "./dto/create-term.dto";
import { UpdateTermDTO } from "./dto/update-term.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/role.guard";
import { Role } from "../user/enums/role.enum";
import { Roles } from "../auth/decorators/role.decorator";
import { ConfirmConsentDTO } from "./dto/confirm-consent.dto";

@Controller("/terms")
@ApiTags("terms")
@ApiBearerAuth()
export class TermController {
  constructor(private termService: TermService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Cria um termo" })
  @ApiResponse({ status: 201, description: "Termo criado com sucesso" })
  async createTerm(

    @Body() { title, content, version, isActive }: CreateTermDTO,
  ) {
    const termCreated = await this.termService.createTerm({
      title: title,
      content: content,
      version: version,
      isActive: isActive,
    });

    return {
      message: "Termo criado com sucesso",
      term: new ListTermsDTO(
        termCreated.id.toString(),
        termCreated.title,
        termCreated.content,
        termCreated.version,
        termCreated.createdAt,
        termCreated.updatedAt,
        termCreated.isActive,),
    };
  }

  @Post('consent/confirm')
  @ApiOperation({ summary: "Confirma o consentimento para os termos assinalados" })
  async confirmConsent(@Body() dto: ConfirmConsentDTO) {
    return this.termService.confirmConsent(dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Lista todos os termos" })
  @ApiResponse({ status: 200, description: "Retorna todos os termos" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async listTerms() {
    const termsSaved = await this.termService.listTerms();

    return {
      mensagem: "Termos obtidos com sucesso.",
      terms: termsSaved,
    };
  }

  @Put("/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Atualizar um termo" })
  async updateTerm(@Param("id") id: string, @Body() newData: UpdateTermDTO) {
    const termUpdated = await this.termService.updateTerm(id, newData);

    return {
      message: "Termo atualizado com sucesso",
      term: termUpdated,
    };
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Deleta um termo" })
  async removeTerm(@Param("id", new ParseUUIDPipe()) id: string) {
    const termRemoved = await this.termService.deleteTerm(id);

    return {
      message: "Termo removido com suceso",
      term: termRemoved,
    };
  }
}
