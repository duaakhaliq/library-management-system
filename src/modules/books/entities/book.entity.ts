import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BookGenre } from 'src/shared/enums/genre-book.enum';

@Entity('books')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ enum: BookGenre })
  genre: BookGenre;

  @Column({ unique: true })
  isbn: string;

  @Column({ default: true })
  availability: boolean;
}
