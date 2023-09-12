// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { BookEntity } from 'src/books/entities/book.entity';
// import { LessThan, IsNull } from 'typeorm';
// 
// @Injectable()
// export class ScheduledTasksService {
//   constructor(
//     @InjectRepository(BookEntity)
//     private readonly bookRepository: Repository<BookEntity>,
//   ) {}
//   //
//   //   @Cron('0 0 * * *') // Schedule to run daily at midnight
//   //   async handleDailyCron() {
//   //     const overdueBooks = await this.bookRepository.find({
//   //       where: {
//   //         dueDate: LessThan(new Date()), // Books with due dates in the past
//   //         returnDate: IsNull(), // Books not yet returned
//   //       },
//   //     });
//   //
//   //     for (const book of overdueBooks) {
//   //       const daysOverdue = Math.ceil(
//   //         (new Date().getTime() - book.dueDate.getTime()) / (1000 * 3600 * 24),
//   //       );
//   //       const fineAmount = daysOverdue * 1; // $1 per day overdue
//   //
//   //       // Update the Book entity with the fine amount
//   //       book.fineAmount = fineAmount;
//   //       await this.bookRepository.save(book);
//   //
//   //       // Send a fine notification to the user (use Nodemailer)
//   //       this.sendFineNotification(book.issuedTo.email, book.title, fineAmount);
//   //     }
//   //
//   //       function calculateFine(dueDate: Date): number {
//   //         const currentDate = new Date();
//   //         const daysOverdue = Math.ceil(
//   //           (currentDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24),
//   //         );
//   //
//   //         const fineAmount = daysOverdue * 1; // $1 per day overdue
//   //         return fineAmount;
//   //       }
//   //   }
//   //
//   //   // Implement the sendFineNotification method here
//   //   // ...
// }
