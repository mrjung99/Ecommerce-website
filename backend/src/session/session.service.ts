import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import * as argon2 from 'argon2';
import { string } from 'joi';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}

  //* --------------- INITIATE SESSION ------------------
  async initiateSession(user: User, meta: { device?: string; ip?: string }) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = this.sessionRepo.create({
      user,
      device: meta.device,
      ip: meta.ip,
      expiresAt,
    });

    return await this.sessionRepo.save(session);
  }

  //* --------------------- SAVE HASHED REFRESH TOKEN -----------------
  async saveHashedSession(sessionId: string, hashedPassword: string) {
    return await this.sessionRepo.update(
      { id: sessionId },
      { hashedRefreshToken: hashedPassword },
    );
  }

  //* --------------- VERIFY HASHED REFRESH TOKEN SESSION ---------------
  async verifyHashedRefreshToken(
    sessionId: string,
    hashedRefreshToken: string,
  ) {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
    });

    if (!session || !session.hashedRefreshToken)
      throw new UnauthorizedException(
        'No session history, please login or register account.',
      );

    return await argon2.verify(session.hashedRefreshToken, hashedRefreshToken);
  }

  //* -------------- REVOKE SESSION --------------
  async revokeSession(sessionid: string) {
    return await this.sessionRepo.update(sessionid, {
      isActive: false,
      hashedRefreshToken: null,
    });
  }

  //* ---------------- REVOKE ALL SESSION -------------
  async revokeAllSession(userId: string) {
    return await this.sessionRepo
      .createQueryBuilder()
      .update(Session)
      .set({ isActive: false, hashedRefreshToken: null })
      .where('userId=:userid AND isActive=true', { userId })
      .execute();
  }
}
