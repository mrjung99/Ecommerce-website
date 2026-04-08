import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendPasswordRest(email: string, url: string) {
    await this.mailer.sendMail({
      to: email,
      subject: 'Reset your password.',
      template: './reset-password',
      context: { url },
    });
  }
}
