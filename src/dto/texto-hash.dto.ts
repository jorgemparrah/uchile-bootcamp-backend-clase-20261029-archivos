import { ApiProperty } from "@nestjs/swagger";

export class TextoHashDto {

  @ApiProperty({ description: 'Contenido del texto', example: 'Hola mundo' })
  contenido: string;

  @ApiProperty({ description: 'Hash', example: 'random_hash_value' })
  hash: string;

}