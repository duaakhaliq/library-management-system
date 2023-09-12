import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/shared/role/decorators/roles.decorator';
import { BookService } from './services/book.service';
import { AddBookDto } from './dtos/add-book.dto';
import { GetBookFilterDto } from './dtos/get-book-filter.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { ApiResponse } from 'src/shared/responses/api-response';
import {
  BOOK_ADDED,
  BOOK_DELETED,
  BOOK_ISSUED,
  BOOK_RETURNED,
  BOOK_UPDATED,
} from 'src/shared/messages/book.message';
import { BorrowBookDto } from './dtos/borrow-book.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BookGenre } from 'src/shared/enums/genre-book.enum';
import { RolesGuard } from 'src/shared/role/role.guard';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Role } from 'src/shared/enums/role-users.enum';

@Controller('books')
@ApiTags('books')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard)
export class BookController {
  constructor(private booksService: BookService) {}

  @Post('add')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Add a book' })
  @ApiBody({ type: AddBookDto })
  async addBook(@Body() addBookDto: AddBookDto): Promise<ApiResponse> {
    await this.booksService.addBook(addBookDto);
    return new ApiResponse(true, BOOK_ADDED);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get books with optional filters' })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Filter by book title',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    enum: BookGenre,
    description: 'Filter by book genre',
  })
  @ApiQuery({
    name: 'author',
    required: false,
    type: String,
    description: 'Filter by book author',
  })
  @ApiQuery({
    name: 'isbn',
    required: false,
    type: String,
    description: 'Filter by book ISBN',
  })
  async getBooks(@Query() filterDto: GetBookFilterDto): Promise<ApiResponse> {
    const books = await this.booksService.getBooks(filterDto);
    return new ApiResponse(true, books);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the book' })
  async getBookById(@Param('id') id: number): Promise<ApiResponse> {
    const book = await this.booksService.getBookById(id);
    return new ApiResponse(true, book);
  }

  @Patch('update')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the book to update',
  })
  @ApiBody({ type: UpdateBookDto })
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<ApiResponse> {
    await this.booksService.updateBook(id, updateBookDto);
    return new ApiResponse(true, BOOK_UPDATED);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the book to delete',
  })
  async removeBook(@Param('id') id: number): Promise<ApiResponse> {
    await this.booksService.removeBook(id);
    return new ApiResponse(true, BOOK_DELETED);
  }

  @Post('issue')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Issue a book' })
  @ApiBody({ type: BorrowBookDto })
  async issueBook(@Body() issueBookDto: BorrowBookDto): Promise<ApiResponse> {
    await this.booksService.issueBook(issueBookDto);
    return new ApiResponse(true, BOOK_ISSUED);
  }

  @Patch('return')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Return a book' })
  @ApiBody({ type: BorrowBookDto })
  async returnBook(@Body() returnBookDto: BorrowBookDto): Promise<ApiResponse> {
    await this.booksService.returnBook(returnBookDto);
    return new ApiResponse(true, BOOK_RETURNED);
  }

  @Get('issued-book/:user')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get issued books for a user by user ID' })
  @ApiParam({ name: 'user', type: Number, description: 'The ID of the user' })
  async getIssuedBook(
    @Param('userId') userId: UserEntity,
  ): Promise<ApiResponse> {
    const issuedBooks = await this.booksService.getIssuedBooks(userId);
    return new ApiResponse(true, issuedBooks);
  }

  @Get('returned-book/:userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get returned books for a user by user ID' })
  @ApiParam({ name: 'userId', type: Number, description: 'The ID of the user' })
  async getReturnedBook(
    @Param('userId') userId: UserEntity,
  ): Promise<ApiResponse> {
    const returnedBooks = await this.booksService.getReturnedBooks(userId);
    return new ApiResponse(true, returnedBooks);
  }
}
