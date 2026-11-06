import { ApiProperty } from "@nestjs/swagger";

export class CopiaArchivoDto {

  @ApiProperty({ description: 'Ruta del archivo', example: 'prueba/archivo.txt' })
  rutaOrigen: string;

  @ApiProperty({ description: 'Ruta de destino del archivo', example: 'prueba/archivo.txt' })
  rutaDestino: string;

}