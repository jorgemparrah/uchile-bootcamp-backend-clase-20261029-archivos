import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { DatosLoginDto } from './dto/datos-login.dto';
import { TokenDataDto } from './dto/token-data.dto';
import { SeguridadService } from './seguridad.service';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {

  listaUsuarios: Usuario[] = [];

  constructor(
    private readonly logger : PinoLogger,
    private readonly seguridadService : SeguridadService,
    private readonly jwtService: JwtService
  ) {
    this.logger.setContext(UsuarioService.name)
    this.listaUsuarios = [];
    // Inicializar lista de usuarios con algunos datos de ejemplo
    const usuarioEjemplo = new Usuario();
    usuarioEjemplo.id = 0;
    usuarioEjemplo.email = 'jorge@prueba.com';
    usuarioEjemplo.password = '$argon2id$v=19$m=65536,t=3,p=4$ni89rIjgdm6ULOJB9gnqyg$C0FmUMsYMc95RNU0J2EnpTilut2kBBgVOQB4DWeCZ1U';
    usuarioEjemplo.role = 'ADMIN';
    this.listaUsuarios.push(usuarioEjemplo);

    const usuarioEjemplo2 = new Usuario();
    usuarioEjemplo2.id = 1;
    usuarioEjemplo2.email = 'usuario@prueba.com';
    usuarioEjemplo2.password = '$argon2id$v=19$m=65536,t=3,p=4$ni89rIjgdm6ULOJB9gnqyg$C0FmUMsYMc95RNU0J2EnpTilut2kBBgVOQB4DWeCZ1U';
    usuarioEjemplo2.role = 'CLIENTE';
    this.listaUsuarios.push(usuarioEjemplo2);
  }

  buscarUsuario(email: string) {
    return this.listaUsuarios.find(usuario => usuario.email === email);
  }

  async registrarUsuario(dto: CreateUsuarioDto) {
    this.logger.info('Registrando nuevo usuario', { email: dto.email });
    const nuevoUsuario = new Usuario();
    nuevoUsuario.id = this.listaUsuarios.length + 1;
    nuevoUsuario.email = dto.email;
    nuevoUsuario.role = 'CLIENTE';
    const dtoHash = await this.seguridadService.hashingArgon2({ contenido: dto.password });
    nuevoUsuario.password = dtoHash.contenido;
    this.listaUsuarios.push(nuevoUsuario);
    this.logger.info('Usuario registrado exitosamente', { email: dto.email });
    return nuevoUsuario;
  }

  async login(dto: DatosLoginDto) {
    this.logger.info(`Intentando login del usuario: ${dto.email}`);
    const usuario = this.buscarUsuario(dto.email);
    if (!usuario) {
      this.logger.warn(`El usuario no existe: ${dto.email}`);
      throw new UnauthorizedException("Credenciales incorrectas");
    }
    const isPasswordValid = await this.seguridadService.verificarHashingArgon2({
      contenido: dto.pass,
      hash: usuario.password
    });
    if (!isPasswordValid) {
      this.logger.warn(`La contraseña es incorrecta: ${dto.email}`);
      throw new UnauthorizedException("Credenciales incorrectas");
    }
    const datosJwt = {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
      prueba: {
        lista: [
          1,2,3,4,5,{
            ejemplo: 'valor'
          }
        ]
      }
    };
    this.logger.debug('Datos para el token JWT', { datosJwt });
    this.logger.info('Generando token JWT', { email: dto.email });
    const token = this.jwtService.sign(datosJwt);
    this.logger.info('Usuario logueado exitosamente', { email: dto.email });
    const tokenData: TokenDataDto = { accessToken: token };
    return tokenData;


  }



}