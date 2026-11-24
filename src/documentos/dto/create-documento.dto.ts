import { ApiProperty } from "@nestjs/swagger";

export class CreateDocumentoDto {

  @ApiProperty({ description: 'ID del documento', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombre del documento', example: 'Documento 1' })
  nombre: string;

  @ApiProperty({ description: 'Texto del documento', example: 'Este es el contenido del documento' })
  texto: string;

  @ApiProperty({ description: 'ID del usuario', example: 1 })
  usuarioId: number;

}
