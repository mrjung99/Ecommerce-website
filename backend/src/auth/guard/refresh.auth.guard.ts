import { AuthGuard } from "@nestjs/passport";
import { extend } from "joi";



export class RefreshAuthGuard extends AuthGuard('refresh') { }