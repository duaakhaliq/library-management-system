import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_BASE_URL,
      pool: true,
      port: 465,
      ignoreTLS: true,
      secure: true,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASSWORD,
      },
    });
  }

  async sendDueDateEmail(userEmail: string, bookTitle: string, dueDate: Date) {
    const mailOptions = {
      from: `Library <${process.env.EMAIL_USERNAME}>`,
      to: userEmail,
      subject: 'Book Due Date Notification',
      text: `Dear User,\n\nThe book "${bookTitle}" is due on ${dueDate.toDateString()}. Please return it on time to avoid fines.\n\nSincerely, Your Library`,
    };
    const info = await this.transporter.sendMail(mailOptions);
  }
}
