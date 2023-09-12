import { Module } from '@nestjs/common';
import { BookService } from './services/book.service';
import { BookController } from './book.controller';
import { BookRepository } from './repositories/book.repository';
import { UserService } from 'src/modules/users/service/user.service';
import { UserRepository } from '../users/repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { EmailService } from './services/email.service';

@Module({
  controllers: [BookController],
  providers: [
    BookService,
    BookRepository,
    UserService,
    UserRepository,
    EmailService,
    JwtService,
    AuthService,
  ],
})
export class BookModule {}
