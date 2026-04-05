import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import RolesGuard from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  //* ------------------------ GET SIGNATURE ---------------------
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(RolesGuard)
  @Get('signature')
  async getSignature(@Query('folder') folder: string = 'products') {
    return await this.cloudinaryService.generateSignature(folder);
  }
}
