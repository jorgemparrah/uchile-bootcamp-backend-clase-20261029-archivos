import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'nestjs-pino';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(
    private readonly logger: Logger,
    private readonly jwtService: JwtService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headerAuthorization = request.headers['authorization'];
    if (!headerAuthorization) {
      throw new UnauthorizedException('Falta el header Authorization');
    }
    const arrayAuthorization = headerAuthorization.split(' ');
    const bearer = arrayAuthorization[0];
    if (bearer !== 'Bearer') {
      throw new UnauthorizedException('El header Authorization debe ser Bearer');
    }
    const token = arrayAuthorization[1];
    if (!token) {
      throw new UnauthorizedException('Falta el token en el header Authorization');
    }
    try {
      const datosUsuario = this.jwtService.verify(token);
      console.log(datosUsuario);
      request.datosUsuario = datosUsuario;
      return true;
    } catch (error) {
      this.logger.error(error);
      this.logger.verbose(error.stack);
      throw new UnauthorizedException('Token inválido');
    }

  }
}
