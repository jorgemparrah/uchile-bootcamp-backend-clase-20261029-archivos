import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuarioService } from './usuario.service';
import { DatosLoginDto } from './dto/datos-login.dto';
import { TokenDataDto } from './dto/token-data.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: UsuarioService) {}

  @Post('registrar')
  async registrarUsuario(@Body() dto : CreateUsuarioDto): Promise<any> {
    const usuario = await this.service.registrarUsuario(dto);
    return {
      id: usuario.id,
      nombre: usuario.email,
      role: usuario.role
    };
  }

  @Post('login')
  async login(@Body() dto: DatosLoginDto, @Res({
    passthrough: true
  }) res): Promise<any> {
    const result = await this.service.login(dto);
    /*
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,   // JS no puede leerla
      secure: true,     // solo por HTTPS
      sameSite: 'strict',
    });
    return { ok: true };
    */
    return result;
  }

}

