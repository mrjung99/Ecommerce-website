import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @Patch('update')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const updatedProfile = await this.profileService.updateProfile(
      userId,
      updateProfileDto,
      file,
    );
    return {
      status: 'success',
      message: 'Profile updated successfully!!',
    };
  }
}
