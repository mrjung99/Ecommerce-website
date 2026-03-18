import { Controller, Req, NotFoundException, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //* ----------------- GET USER AND PROFILE ---------------
  @Get()
  async getUserAndProfile(@Req() req: any) {
    const userId = req.user.id;
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found!!');
    }

    return {
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    };
  }
}
