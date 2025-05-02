import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsUUID, MinLength } from "class-validator";
import { UniqueEmail } from "../validation/UniqueEmail.validation";
import { Role } from "../enums/role.enum";

export class CreateUserDTO {
  @IsNotEmpty({ message: "O nome não pode ser vazio" })
  name: string;

  @IsEmail(undefined, { message: "O e-mail informado é inválido" })
  @UniqueEmail({ message: "Já existe um usuário com este e-mail" })
  email: string;

  @MinLength(6, { message: "A senha precisa ter pelo menos 6 caracteres" })
  password: string;

  @IsEnum(Role, { message: "O papel deve ser um dos seguintes: ADMIN, EMPLOYEE" })
  @IsNotEmpty({ message: "O papel não pode estar vazio" })
  role: Role;

  @IsArray()
  @IsUUID('all', { each: true })
  acceptedTermIds: string[]; // ← IDs dos termos que o usuário aceitou
}
