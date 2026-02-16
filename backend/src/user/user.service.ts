import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import argon2 from 'argon2'

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User)
      private readonly userRepo: Repository<User>
   ) { }

   //* ------------- FIND USER BY EMAIL -------------------
   async findOneByEmail(email: string) {
      return await this.userRepo.findOneBy({ email })
   }


   //* ----------------SIGN UP ----------
   async signUP(createUserDto: CreateUserDto) {
      createUserDto.profile = createUserDto.profile ?? {}
      try {
         const hashedPassword = await argon2.hash(createUserDto.password)
         const user = this.userRepo.create({
            password_hashed: hashedPassword,
            ...createUserDto
         })

         return await this.userRepo.save(user)

      } catch (error) {
         if (error.code === '23505') {
            if (error.detail.includes('email')) {
               throw new BadRequestException({
                  status: 'fail',
                  field: 'email',
                  message: "User with the email already exist!!"
               })
            }
         }
      }
   }


   //* -----------------VALIDATE USER (CALLED BY JWT-STRATEGY) -----------------
   async validateJwtUser(userId: string) {
      const user = await this.userRepo.findOne({
         where: {
            id: userId
         },
         select: {
            id: true,
            email: true
         }
      });

      if (!user) {
         throw new UnauthorizedException("User is not authorized!!");
      }

      return user;
   }

}
