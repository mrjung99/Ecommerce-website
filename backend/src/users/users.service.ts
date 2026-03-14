import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  //* ------------------CREATE USER --------------
  async createUser(createUserDto: CreateUserDto) {
    try {
      createUserDto.profile = createUserDto.profile ?? {};
      const hashedPassword = await argon2.hash(createUserDto.password);
      const user = this.userRepo.create({
        ...createUserDto,
        password: hashedPassword,
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
    const user = this.userRepo.findOne({
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
}
