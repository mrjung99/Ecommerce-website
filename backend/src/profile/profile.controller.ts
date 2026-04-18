import { Controller, Post, Body, Patch, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';

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
}
