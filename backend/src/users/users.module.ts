import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProfileModule } from '../profile/profile.module';
import { Profile } from '../profile/entities/profile.entity';
import { PasswordReset } from './entities/password-reset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, PasswordReset]),
    forwardRef(() => ProfileModule),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
