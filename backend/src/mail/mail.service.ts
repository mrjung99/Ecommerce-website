import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { SendMailDto } from './dto/sendMail.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly configService: ConfigService) {}

  getMailTransporter() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.pass'),
      },
    });

    return transporter;
  }

  async sendMail(dto: SendMailDto) {
    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('mail.user'),
      to: dto.recipients,
      subject: dto.subject,
      html: dto.html,
      text: dto.text,
    };

    const transporter = this.getMailTransporter();

    try {
      transporter.sendMail(options);
      this.logger.log(`Mail has been sent to ${dto.recipients}`);
    } catch (error) {
      this.logger.warn(`Error while sending mail, ERROR: ${error}`);
    }
  }
}
