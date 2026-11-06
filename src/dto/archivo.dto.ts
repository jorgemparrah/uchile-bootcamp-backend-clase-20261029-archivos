import { ApiProperty } from "@nestjs/swagger";

export class ArchivoDto {

  @ApiProperty({ description: 'Ruta del archivo', example: 'prueba/archivo.txt' })
  ruta: string;

  @ApiProperty({ description: 'Contenido del archivo', example: 'Este es el contenido del archivo' })
  contenido: string;

}