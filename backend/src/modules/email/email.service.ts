import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendEmail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: "teamcodemain@gmail.com",
      to,
      subject,
      html,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
