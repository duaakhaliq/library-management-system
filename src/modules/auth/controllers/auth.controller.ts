import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard, Public } from '../guards/auth.guard';
import { LoginDto } from '../dtos/login-auth.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { ApiResponse } from 'src/shared/responses/api-response';
import { USER_CREATED, USER_LOGOUT } from 'src/shared/messages/user.message';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  async signup(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    await this.authService.createUser(createUserDto);
    return new ApiResponse(true, USER_CREATED);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const login = await this.authService.signin(loginDto);
    return new ApiResponse(true, login);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  async logout(@Req() request: any) {
    try {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      if (!token) {
        throw new UnauthorizedException('Token missing');
      }
      await this.authService.logout(token);
      return new ApiResponse(true, USER_LOGOUT);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
