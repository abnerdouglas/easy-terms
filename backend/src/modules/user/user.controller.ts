import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards} from "@nestjs/common";
import { ListUsersDTO } from "./dto/ListUser.dto";
import { CreateUserDTO } from "./dto/CreateUser.dto";
import { UserService } from "./user.service";
import { UpdateUserDTO } from "./dto/UpdateUser.dto";
import { HashPasswordPipe } from "src/resources/pipes/hashPassword";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/role.guard";
import { Roles } from "../auth/decorators/role.decorator";
import { Role } from "./enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("/users")
@ApiTags("users")
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) { }

  @Post()
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({ summary: "Create user" })
  @ApiResponse({ status: 201, description: "User created sucessfully." })
  async createUser(

    @Body() { name, email, role, acceptedTermIds }: CreateUserDTO,
    @Body("password", HashPasswordPipe) hashedPassword: string,
  ) {
    const userCreated = await this.userService.createUser({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      acceptedTermIds: acceptedTermIds,
    });

    return {
      message: "Usuário criado com sucesso",
      user: new ListUsersDTO(
        userCreated.id, 
        userCreated.name,
        userCreated.email,
        userCreated.role,
        userCreated.createdAt,
        userCreated.updatedAt,
      ),
    };
  }

  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE)
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
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({ summary: "Update user" })
  async updateUser(@Param("id") id: string, @Body() newData: UpdateUserDTO) {
    const userUpdated = await this.userService.updateUser(id, newData);

    return {
      message: "Usuário atualizado com sucesso",
      user: userUpdated,
    };
  }

  @Delete("/:id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete user" })
  async removeUser(@Param("id", new ParseUUIDPipe()) id: string) {
    const userRemoved = await this.userService.deleteUser(id);

    return {
      message: "Usuário removido com sucesso",
      user: userRemoved,
    };
  }

}
