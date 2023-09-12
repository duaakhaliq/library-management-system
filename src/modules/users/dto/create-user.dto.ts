import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/shared/enums/role-users.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Username' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, description: 'Email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Password' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Confirm Password' })
  confirmPassword: string;

  @IsOptional()
  @ApiPropertyOptional({
    enum: Role,
    default: Role.USER,
    description: 'User Role',
  })
  role?: Role;
}
