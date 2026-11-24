import { ApiProperty } from "@nestjs/swagger";

export class TokenDataDto {

  @ApiProperty({ description: 'Access token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

}