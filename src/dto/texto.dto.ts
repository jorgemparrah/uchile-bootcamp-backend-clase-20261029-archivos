import { ApiProperty } from "@nestjs/swagger";

export class TextoDto {

  @ApiProperty({ description: 'Contenido del texto', example: 'Hola mundo' })
  contenido: string;

}