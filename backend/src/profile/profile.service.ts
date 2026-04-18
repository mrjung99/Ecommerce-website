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
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  //* ------------------------- CREATE PROFILE -------------------
  async createProfile(userid: string, createProfileDto: CreateProfileDto) {
    const user = await this.userRepo.findOne({
      where: { id: userid },
    });
    if (!user) {
      throw new NotFoundException('User not found!!');
    }

    const profile = this.profileRepo.create(createProfileDto);
    user.profile = profile;

    await this.userRepo.save(user);
    return profile;
  }

  //* ------------------------- UPDATE PROFILE -------------------
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found!!');
    }

    if (!user.profile) {
      user.profile = this.profileRepo.create({});
      await this.profileRepo.save(user.profile);
    }

    Object.assign(user.profile, updateProfileDto || {});

    await this.userRepo.save(user);
    return user.profile;
  }

  //* ------------------------- GET PROFILE -------------------
}
