import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookGenre } from 'src/shared/enums/genre-book.enum';

export class AddBookDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Title of the book' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Author of the book' })
  author: string;

  @IsNotEmpty()
  @IsEnum(BookGenre)
  @ApiProperty({ enum: BookGenre, description: 'Genre of the book' })
  genre: BookGenre;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'ISBN of the book' })
  isbn: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Availability status of the book' })
  availability: boolean;
}
