import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/constant/constant';
import { Role } from '../enum/role.enum';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // means the route handler or class is available for all(public)
    }

    const user = context.switchToHttp().getRequest().user;

    const hasRequiredRoles = requiredRoles.some((role) =>
      user.role.includes(role),
    );
    return hasRequiredRoles; // if hasRequiredRoles return true then it will allow access if false deny
  }
}
