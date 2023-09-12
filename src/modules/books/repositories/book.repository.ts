import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { BookEntity } from '../entities/book.entity';
import { AddBookDto } from '../dtos/add-book.dto';
import { GetBookFilterDto } from '../dtos/get-book-filter.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UpdateBookDto } from '../dtos/update-book.dto';
import { BorrowBookDto } from '../dtos/borrow-book.dto';
import { UserService } from 'src/modules/users/service/user.service';
import { BorrowingRecordEntity } from '../entities/borrowing-record.entity';
import { EmailService } from '../services/email.service';
import {
  BOOK_ALREADY_EXIST,
  BOOK_NOT_AVAILABLE,
  BOOK_NOT_FOUND,
} from 'src/shared/messages/book.message';

@Injectable()
export class BookRepository extends Repository<BookEntity> {
  constructor(
    dataSource: DataSource,
    private readonly userService: UserService,
    private readonly entityManager: EntityManager,
    private readonly emailService: EmailService,
  ) {
    super(BookEntity, dataSource.createEntityManager());
  }

  async addBook(addBookDto: AddBookDto): Promise<BookEntity> {
    const { title, author, genre, isbn, availability } = addBookDto;

    const book = this.create({
      title,
      author,
      genre,
      isbn,
      availability,
    });
    await this.save(book);
    return book;
  }

  async getBooks(filterDto: GetBookFilterDto): Promise<BookEntity[]> {
    const { genre, title, author, isbn } = filterDto;
    const query = this.createQueryBuilder('book');

    if (genre) {
      query.andWhere('book.genre = :genre', { genre });
    }
    if (author) {
      query.andWhere('book.author = :author', { author });
    }
    if (title) {
      query.andWhere('book.title LIKE :title', { title: `%${title}%` });
    }
    if (isbn) {
      query.andWhere('book.isbn = :isbn', { isbn });
    }

    try {
      const books = await query.getMany();
      return books;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto) {
    try {
      await this.update(id, updateBookDto);
    } catch (error) {
      throw new HttpException(
        "Unable to update this book's information",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getBookById(id: number): Promise<BookEntity> {
    const book = await this.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(BOOK_NOT_FOUND);
    }
    return book;
  }

  async removeBook(id: number): Promise<void> {
    const book = await this.delete(id);
  }

  async issueBook(issueBookDto: BorrowBookDto): Promise<void> {
    const { bookId, userEmail } = issueBookDto;
    const book = await this.getBookById(bookId);
    const user = await this.userService.getUserByEmail(userEmail);

    if (!book.availability) {
      throw new ConflictException(BOOK_NOT_AVAILABLE);
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrowingRecord = new BorrowingRecordEntity();
    borrowingRecord.book = book;
    borrowingRecord.user = user;
    borrowingRecord.dueDate = dueDate;

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(
        BorrowingRecordEntity,
        borrowingRecord,
      );
      await transactionalEntityManager.update(BookEntity, bookId, {
        availability: false,
      });
    });
    this.emailService.sendDueDateEmail(user.email, book.title, dueDate);
  }

  async returnBook(returnBookDto: BorrowBookDto) {
    const { bookId, userEmail } = returnBookDto;
    const book = await this.getBookById(bookId);
    const user = await this.userService.getUserByEmail(userEmail);

    if (book.availability) {
      throw new ConflictException('The book is already marked as returned.');
    }

    try {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          const borrowingRecord = await transactionalEntityManager.findOneBy(
            BorrowingRecordEntity,
            { book, user },
          );
          if (!borrowingRecord) {
            throw new NotFoundException(
              'No borrowing record found for this book and user.',
            );
          }

          await transactionalEntityManager.remove(
            BorrowingRecordEntity,
            borrowingRecord,
          );
          await transactionalEntityManager.update(BookEntity, bookId, {
            availability: true,
          });
        },
      );
    } catch (error) {
      throw new HttpException(
        'Failed to return the book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getIssuedBooks(user: UserEntity): Promise<BookEntity[]> {
    try {
      const issuedBooks = await this.entityManager.findBy(
        BorrowingRecordEntity,
        {
          user,
        },
      );
      return issuedBooks.map((record) => record.book);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch issued books',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getReturnedBooks(user: UserEntity): Promise<BookEntity[]> {
    try {
      const returnedBooks = await this.entityManager.query(
        `
        SELECT DISTINCT b.*
        FROM book b
        INNER JOIN borrowing_record br ON b.id = br.bookId
        WHERE br.userId = ?
      `,
        [user.id],
      );
      return returnedBooks;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch returned books',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
