import { ApiProperty } from "@nestjs/swagger";

export class InformacionCifradaDto {

  @ApiProperty({ description: 'Contenido del texto', example: 'Hola mundo' })
  textoEncriptado: string;

  @ApiProperty({ description: 'IV utilizado para el cifrado', example: 'a1b2c3d4e5f6g7h8i9j0k1l2' })
  iv: string;

  @ApiProperty({ description: 'Tag de autenticación', example: 'a1b2c3d4e5f6g7h8i9j0k1l2' })
  tag: string;

}