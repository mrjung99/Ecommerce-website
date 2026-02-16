import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/common/decorator/role.decorator";
import { Role } from "../enums/role.enum";



@Injectable()
export class RolesGuard implements CanActivate {
   constructor(
      private readonly reflector: Reflector,
   ) { }
   canActivate(context: ExecutionContext): boolean {
      const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
         context.getClass(),
         context.getHandler()
      ]);

      if (!requiredRole || requiredRole.length === 0) return true;

      const user = context.switchToHttp().getRequest().user;
      const hasRequiredRole = requiredRole.some(role => user.role === role);
      return hasRequiredRole;
   }
}