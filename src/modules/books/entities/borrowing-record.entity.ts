import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { BookEntity } from '../../books/entities/book.entity';

@Entity('borrowing_records')
export class BorrowingRecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BookEntity, { eager: true })
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_email', referencedColumnName: 'email' })
  user: UserEntity;

  @Column({
    name: 'borrowed_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  borrowedDate: Date;

  @Column({
    name: 'due_date',
    type: 'timestamp',
  })
  dueDate: Date;
}
