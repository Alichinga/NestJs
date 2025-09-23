import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_USER'), // sender
        to,                                                // recipient
        subject,                                           // subject line
        text,                                              // plain text body
        // html: `<b>${text}</b>`  // optional: send HTML body
      });
      return `📩 Mail sent to ${to}`;
    } catch (error) {
      console.error('❌ Error sending mail:', error);
      return 'Failed to send mail';
    }
  }
}
