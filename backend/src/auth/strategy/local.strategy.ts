import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
    this.logger.log('LocalStrategy registered');
      this.logger.log('Strategy name:', Strategy.name);
  }

  async validate(email: string, password: string) {
        this.logger.log(`Validating user: ${email}`);
    const user = await this.authService.validateUser(email, password);
    this.logger.log("LocalStrategy registered")
    if (!user) {
       this.logger.warn(`Validation failed for: ${email}`);
      throw new UnauthorizedException();
    }

     this.logger.log(`Validation successful for: ${email}`);
    return user;
  }
}
