import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { USER_NOT_FOUND } from '../../../shared/messages/user.message';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, email, password, confirmPassword, role } = createUserDto;

    const existingUser = await this.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    if (password !== confirmPassword) {
      throw new ConflictException('Password and confirm password must match');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      email,
      password: hashedPassword,
      role: role,
    });

    return this.save(user);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return this.findOne({ where: { email } });
  }

  async getUserById(id: number): Promise<UserEntity> {
    return this.findOne({ where: { id } });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.find();
  }

  async deleteUser(email: string): Promise<void> {
    const result = await this.delete({ email });
  }

  async updateUser(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    Object.assign(user, updateUserDto);

    return this.save(user);
  }
}
