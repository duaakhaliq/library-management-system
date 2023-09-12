import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { USER_NOT_FOUND } from 'src/shared/messages/user.message';

@Injectable()
export class UserService {
  findOneById(id: number): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.createUser(createUserDto);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.getAllUsers();
  }

  async deleteUser(email: string): Promise<void> {
    return this.userRepository.deleteUser(email);
  }

  async updateUser(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userRepository.updateUser(email, updateUserDto);
  }
}
