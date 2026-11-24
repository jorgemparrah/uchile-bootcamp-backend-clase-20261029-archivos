import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(
      'DECORADOR_ROLES', [context.getHandler(), context.getClass()],
    );

    const user = request.datosUsuario;
    console.log('ROLES REQUERIDOS:', rolesRequeridos)
    console.log('ROL DEL USUARIO :', user?.role)
    if (!user || !rolesRequeridos.includes(user.role)) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }
    return true;
  }
}
