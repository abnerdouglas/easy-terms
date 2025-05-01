import { IsNotEmpty } from "class-validator";

export class CreateTermDTO {
  @IsNotEmpty({ message: "O título não pode ser vazio" })
  title: string;

  @IsNotEmpty({ message: "O conteúdo não pode ser vazio" })
  content: string;
}
