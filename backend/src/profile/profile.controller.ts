import { Controller, Post, Body, Patch, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  //* -------------------- CREATE PROFILE ------------------------
  @Patch('update')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Update profile' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createProfile(@Body() dto: CreateProfileDto, @Req() req: any) {
    const userId: string = req.user.id;
    const profile = await this.profileService.updateProfile(userId, dto);
    return {
      status: 'success',
      message: 'Profile updated successfully!',
      profile,
    };
  }

  //* -------------------- UPDATE PROFILE ------------------------
}
