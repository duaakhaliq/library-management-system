import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserService } from 'src/modules/users/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../users/repository/user.repository';
import { UserModule } from 'src/modules/users/user.module';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_IN },
    }),
  ],
  providers: [AuthService, UserService, JwtService, UserRepository],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
