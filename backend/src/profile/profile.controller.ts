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

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  //* -------------------- CREATE PROFILE ------------------------
  @Post('create')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Create profile' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
