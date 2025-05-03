import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "../enums/role.enum";
import { UniqueEmail } from "../validation/UniqueEmail.validation";

export class UpdateUserDTO {
    @IsNotEmpty({ message: "O nome não pode ser vazio" })
    name: string;

    @IsEmail(undefined, { message: "O e-mail informado é inválido" })
    @UniqueEmail({ message: "Já existe um usuário com este e-mail" })
    email: string;

    @IsEnum(Role, { message: "O papel deve ser ADMIN ou EMPLOYEE" })
    role: Role;

    @IsOptional()
    acceptedTermIds?: string[];
}

