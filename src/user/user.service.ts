import { Injectable, ConflictException } from '@nestjs/common';
import { User, UserResponse } from '../interfaces/user.interfase';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [];
  private currentIdx = 1;

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { id, password, nickname } = createUserDto;

    const existingUser = this.users.find(user => user.id === id);
    if (existingUser) {
      throw new ConflictException('이미 사용중인 아이디입니다.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user: User = {
      idx: this.currentIdx++,
      id,
      password: hashedPassword,
      nickname,
      createdAt: new Date(),
    };

    this.users.push(user);

    return {
      idx: user.idx,
      id: user.id,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };
  }

  async findByIdForAuth(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findById(id: string): Promise<UserResponse | null> {
    const user = this.users.find(user => user.id === id);
    if (!user) return null;

    return {
      idx: user.idx,
      id: user.id,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  getAllUsers(): UserResponse[] {
    return this.users.map(user => ({
      idx: user.idx,
      id: user.id,
      nickname: user.nickname,
      createdAt: user.createdAt,
    }));
  }

  getUserCount(): number {
    return this.users.length;
  }
}
