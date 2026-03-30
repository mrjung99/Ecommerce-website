import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { ImageUploadService } from 'src/image-upload/image-upload.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  //* ------------------------- CREATE PROFILE -------------------
  async createProfile(userid: string, createProfileDto: CreateProfileDto) {
    const user = await this.userService.findUserById(userid);
    if (!user) {
      throw new NotFoundException('User not found!!');
    }

    const profile = this.profileRepo.create(createProfileDto);
    user.profile = profile;

    await this.userRepo.save(user);
    return profile;
  }

  //* ------------------------- UPDATE PROFILE -------------------
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found!!');
    }

    if (!user.profile) {
      user.profile = this.profileRepo.create({});
      await this.profileRepo.save(user.profile);
    }

    Object.assign(user.profile, updateProfileDto || {});

    if (file) {
      try {
        const image = await this.imageUploadService.replaceImage(
          file,
          user.profile.avatarPublicId,
          'users',
        );
        user.profile.avatarUrl = image.thumbnail;
        user.profile.avatarPublicId = image.publicId;
      } catch (error) {
        console.log('IMAGE UPLOAD FAILED:', error);
      }
    }
    await this.userRepo.save(user);
    return user.profile;
  }

  //* ------------------------- GET PROFILE -------------------
}
