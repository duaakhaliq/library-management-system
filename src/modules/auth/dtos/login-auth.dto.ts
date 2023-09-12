import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Password' })
  password: string;
}
