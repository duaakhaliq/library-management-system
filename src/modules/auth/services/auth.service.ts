import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login-auth.dto';
import { UserService } from 'src/modules/users/service/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { jwtConstants } from '../../../shared/constants/jwt.constants';

@Injectable()
export class AuthService {
  private revokedTokens: string[] = [];

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  async signin(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.userService.getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken: string = await this.generateAccessToken(user);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async logout(token: string): Promise<void> {
    await this.revokedTokens.push(token);
  }

  isTokenRevoked(token: string): boolean {
    return this.revokedTokens.includes(token);
  }

  async generateAccessToken(user: UserEntity) {
    const payload = { id: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload, jwtConstants);
    return accessToken;
  }
}
