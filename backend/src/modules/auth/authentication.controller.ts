import { Controller, Post, Body } from "@nestjs/common";
import { AuthDTO } from "./dto/auth.dto";
import { AuthenticationService } from "./authentication.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("auth")
@ApiTags("auth")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("login")
  @ApiOperation({ summary: "Autenticação do usuário" })
  login(@Body() { email, password }: AuthDTO) {
    return this.authenticationService.login(email, password);
  }
}
