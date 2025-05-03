import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTermDTO {
  @ApiProperty({ example: 'Termo de Uso', description: 'Título do termo' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Conteúdo completo do termo', description: 'Texto do termo de uso' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'v1.0', description: 'Versão do termo' })
  @IsString()
  version: string;

  @ApiProperty({ example: true, description: 'Define se o termo está ativo' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
