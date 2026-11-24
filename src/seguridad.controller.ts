import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { TextoDto } from './dto/texto.dto';
import { SeguridadService } from './seguridad.service';
import { InformacionCifradaDto } from './dto/informacion-cifrada.dto';
import { ApiParam } from '@nestjs/swagger';
import { TextoHashDto } from './dto/texto-hash.dto';

@Controller('seguridad')
export class SeguridadController {
  constructor(private readonly service: SeguridadService) {}

  @Post('cifrar-simetrico')
  cifrarSimetrico(@Body() dto : TextoDto, @Req() req): InformacionCifradaDto {
    console.log(req);
    return this.service.cifrarSimetrico(dto);
  }

  @Post('descrifrar-simetrico')
  descrifrarSimetrico(@Body() dto : InformacionCifradaDto): TextoDto {
    return this.service.descrifrarSimetrico(dto.iv, dto.textoEncriptado, dto.tag);
  }

  @Post('cifrar-asimetrico')
  cifrarASimetrico(@Body() dto : TextoDto): TextoDto {
    return this.service.cifrarAsimetrico(dto);
  }

  @Post('descrifrar-asimetrico')
  descrifrarASimetrico(@Body() dto : TextoDto): TextoDto {
    return this.service.descifrarAsimetrico(dto);
  }

  @Post('hashing')
  hashing(@Body() dto : TextoDto): TextoDto {
    return this.service.hashing(dto);
  }

  @ApiParam({ name: 'salt', required: true, description: 'Salt value for hashing' })
  @Post('hashing-with-salt/:salt')
  hashingWithSalt(@Body() dto : TextoDto, @Param('salt') salt: string): TextoDto {
    return this.service.hashingWithSalt(dto, salt);
  }

  @Post('hashing-argon2')
  hashingArgon2(@Body() dto : TextoDto): Promise<TextoDto> {
    return this.service.hashingArgon2(dto);
  }

  @Post('verificar-hashing-argon2')
  async verificarHashingArgon2(@Body() dto : TextoHashDto): Promise<TextoDto> {
    const valid = await this.service.verificarHashingArgon2(dto);
    const response = new TextoDto();
    response.contenido = valid ? 'Valido' : 'Invalido';
    return response;
  }


}

