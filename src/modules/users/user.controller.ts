import {
  Controller,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from 'src/shared/responses/api-response';
import { USER_DELETED, USER_UPDATED } from 'src/shared/messages/user.message';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/shared/role/role.guard';
import { Roles } from 'src/shared/role/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role-users.enum';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @ApiOperation({ summary: 'Update a user by email' })
  @ApiParam({ name: 'email', type: String, description: 'User email' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('email', ParseIntPipe) email: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse> {
    await this.userService.updateUser(email, updateUserDto);
    return new ApiResponse(true, USER_UPDATED);
  }

  @Delete()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a user by email' })
  @ApiParam({ name: 'email', type: String, description: 'User email' })
  async deleteUser(@Param('email') email: string): Promise<ApiResponse> {
    await this.userService.deleteUser(email);
    return new ApiResponse(true, USER_DELETED);
  }

  @Get(':email')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiParam({ name: 'email', type: String, description: 'User email' })
  async getUserByEmail(@Param('email') email: string): Promise<ApiResponse> {
    const user = await this.userService.getUserByEmail(email);
    return new ApiResponse(true, user);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async getUserById(@Param('id') id: number): Promise<ApiResponse> {
    const user = await this.userService.getUserById(id);
    return new ApiResponse(true, user);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  async getUsers(@Req() request: any): Promise<ApiResponse> {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    const users = await this.userService.getAllUsers();
    return new ApiResponse(true, users);
  }
}
