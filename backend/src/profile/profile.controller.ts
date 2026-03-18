import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  //* -------------------- CREATE PROFILE ------------------------
  @Post('create')
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
    @Req() req: any,
  ) {
    const userId: string = req.user.id;
    const profile = await this.profileService.createProfile(
      userId,
      createProfileDto,
    );
    return {
      status: 'success',
      message: 'Profile created successfully!',
    };
  }

  //* -------------------- UPDATE PROFILE ------------------------
  @Post('update')
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const updatedProfile = await this.profileService.updateProfile(
      userId,
      updateProfileDto,
    );
    return {
      status: 'success',
      message: 'Profile updated successfully!!',
    };
  }
}
