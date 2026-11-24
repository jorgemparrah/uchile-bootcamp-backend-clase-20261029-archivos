import { ApiProperty } from "@nestjs/swagger";

export class CreateUsuarioDto {

  @ApiProperty({ description: 'Email del usuario', example: 'usuario@prueba.com' })
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'password123' })
  password: string;

}