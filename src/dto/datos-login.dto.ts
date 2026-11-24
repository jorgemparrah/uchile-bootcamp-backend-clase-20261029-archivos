import { ApiProperty } from "@nestjs/swagger";

export class DatosLoginDto {

  @ApiProperty({ description: 'Email del usuario', example: 'jorge@prueba.com' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  pass: string;

}