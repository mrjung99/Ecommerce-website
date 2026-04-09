import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Profile } from '../profile/entities/profile.entity';

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
      // check user already exist or not
      const userExist = await this.userRepo.findOne({
        where: { email: createUserDto.email },
      });

      if (userExist) {
        throw new ConflictException('User already exist with that email.');
      }

      const profile = this.profileRepo.create(createUserDto.profile || {});
      const hashedPassword = await argon2.hash(createUserDto.password);
      const user = this.userRepo.create({
        ...createUserDto,
        password: hashedPassword,
        profile,
      });

      return await this.userRepo.save(user);
    } catch (error: any) {
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
    return await this.userRepo.findOne({
      where:{email}
    })
    
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
