import { forwardRef, Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { ImageUploadModule } from '../image-upload/image-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, User]),
    ImageUploadModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports:[TypeOrmModule,ProfileService]
})
export class ProfileModule {}
