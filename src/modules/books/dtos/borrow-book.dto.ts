import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import the ApiProperty decorator

export class BorrowBookDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the book to be issued' })
  bookId: number;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Email of the user who is issuing the book' })
  userEmail: string;
}
