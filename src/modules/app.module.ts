import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';
import { BookModule } from './books/book.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_IN },
    }),
    AuthModule,
    UserModule,
    BookModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
