import { ApiProperty } from "@nestjs/swagger";
import { MaxLength } from "class-validator";

export class CargaArchivoBinarioDto {
  
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @MaxLength(10, { message: 'El nombre no puede tener más de 10 caracteres' })
  nombre: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  @MaxLength(10, { message: 'El apellido no puede tener más de 10 caracteres' })
  apellido: string;

  @ApiProperty({ description: 'Imagen del usuario', type: 'string', format: 'binary' })
  imagen: any;

}