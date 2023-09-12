import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtService, AuthService],
})
export class UserModule {}
