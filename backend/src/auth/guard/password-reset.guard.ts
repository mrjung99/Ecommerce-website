import { AuthGuard } from '@nestjs/passport';

export class PasswordResetGuard extends AuthGuard('jwt-password-reset') {}
