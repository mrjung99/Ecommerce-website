import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { IS_PUBLIC_FIELD_KEY } from "src/common/decorator/public.decorator";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
   constructor(
      private readonly reflector: Reflector,
   ) {
      super();
   };

   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_FIELD_KEY, [
         context.getClass(),
         context.getHandler()
      ]);

      if (isPublic) return true;

      return super.canActivate(context);
   };
}