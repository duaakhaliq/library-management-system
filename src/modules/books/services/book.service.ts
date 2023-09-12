import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';
import { AddBookDto } from '../dtos/add-book.dto';
import { GetBookFilterDto } from '../dtos/get-book-filter.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';
import { BorrowBookDto } from '../dtos/borrow-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async addBook(addBookDto: AddBookDto): Promise<BookEntity> {
    return this.bookRepository.addBook(addBookDto);
  }
  async getBooks(filterDto: GetBookFilterDto): Promise<BookEntity[]> {
    return await this.bookRepository.getBooks(filterDto);
  }

  async getBookById(id: number): Promise<BookEntity> {
    return await this.bookRepository.getBookById(id);
  }

  async removeBook(id: number): Promise<void> {
    await this.bookRepository.removeBook(id);
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto) {
    return await this.bookRepository.updateBook(id, updateBookDto);
  }

  async issueBook(issueBookDto: BorrowBookDto) {
    return await this.bookRepository.issueBook(issueBookDto);
  }

  async returnBook(returnBookDto: BorrowBookDto) {
    return await this.bookRepository.returnBook(returnBookDto);
  }

  async getIssuedBooks(user: UserEntity): Promise<BookEntity[]> {
    return await this.bookRepository.getIssuedBooks(user);
  }

  async getReturnedBooks(user: UserEntity): Promise<BookEntity[]> {
    return await this.bookRepository.getReturnedBooks(user);
  }
}
