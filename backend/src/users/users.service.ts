import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { ProfileService } from 'src/profile/profile.service';
import { Profile } from 'src/profile/entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  //* ------------------CREATE USER --------------
  async createUser(createUserDto: CreateUserDto) {
    try {
      const profile = this.profileRepo.create(createUserDto.profile || {});
      const hashedPassword = await argon2.hash(createUserDto.password);
      const user = this.userRepo.create({
        ...createUserDto,
        password: hashedPassword,
        profile,
      });

      await this.userRepo.save(user);
      return true;
    } catch (error) {
      if (error.code === '23505') {
        if (error.detail.includes('email')) {
          throw new BadRequestException({
            status: 'fail',
            field: 'email',
            message: 'User with this email already exist!!',
          });
        }
      }
    }
  }

  //* ------------------ FIND USER BY EMAIL--------------
  async findUserByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  //* ------------------ FIND USER BY ID--------------
  async findUserById(userId: string) {
    return await this.userRepo.findOneBy({ id: userId });
  }

  //* ------------------ VALIDATE JWT USER --------------
  async validateJwtUser(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  //* ------------------ SAVE HASHED REFRESH TOKEN --------------
  async saveHashedRefreshToken(userId: string, hashedRefreshToken: string) {
    return await this.userRepo.update({ id: userId }, { hashedRefreshToken });
  }

  //* ------------------ SAVE USER --------------
  async saveProfile(user: User) {
    return await this.userRepo.save(user);
  }
}
