import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ListUsersDTO } from "./dto/ListUser.dto";
import { CreateUserDTO } from "./dto/CreateUser.dto";
import { UserService } from "./user.service";
import { UpdateUserDTO } from "./dto/UpdateUser.dto";
import { HashPasswordPipe } from "src/resources/pipes/hashPassword";
import { AuthenticationGuard } from "../auth/authentication.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@UseGuards(AuthenticationGuard)
@Controller("/users")
@ApiTags("users")
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) { }

  @Post()
  @ApiOperation({ summary: "Create user" })
  @ApiResponse({ status: 201, description: "User created sucessfully." })
  async createUser(

    @Body() { name, email }: CreateUserDTO,
    @Body("password", HashPasswordPipe) hashedPassword: string,
  ) {
    const userCreated = await this.userService.createUser({
      name: name,
      email: email,
      password: hashedPassword,
    });

    return {
      message: "Usuário criado com sucesso",
      user: new ListUsersDTO(userCreated.id, userCreated.name),
    };
  }

  @Get()
  @ApiOperation({ summary: "List all users" })
  @ApiResponse({ status: 200, description: "Return all users." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async listUsers() {
    const usersSaved = await this.userService.listUsers();

    return {
      mensagem: "Usuários obtidos com sucesso.",
      users: usersSaved,
    };
  }

  @Put("/:id")
  @ApiOperation({ summary: "Update user" })
  async updateUser(@Param("id") id: string, @Body() newData: UpdateUserDTO) {
    const userUpdated = await this.userService.updateUser(id, newData);

    return {
      message: "Usuário atualizado com sucesso",
      user: userUpdated,
    };
  }

  @Delete("/:id")
  @ApiOperation({ summary: "Delete user" })
  async removeUser(@Param("id", new ParseUUIDPipe()) id: string) {
    const userRemoved = await this.userService.deleteUser(id);

    return {
      message: "Usuário removido com sucesso",
      user: userRemoved,
    };
  }

}
