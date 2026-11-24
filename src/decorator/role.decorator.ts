import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) =>
  SetMetadata('DECORADOR_ROLES', roles);