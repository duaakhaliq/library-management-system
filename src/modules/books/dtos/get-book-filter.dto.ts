import { IsEnum, IsOptional } from 'class-validator';
import { BookGenre } from 'src/shared/enums/genre-book.enum';

export class GetBookFilterDto {
  @IsOptional()
  @IsEnum(BookGenre)
  genre?: BookGenre;

  @IsOptional()
  author?: string;

  @IsOptional()
  title?: string;

  @IsOptional()
  isbn?: string;
}
