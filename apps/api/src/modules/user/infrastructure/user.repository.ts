// Infrastructure: Repository Implementation
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../domain/entities/user.entity';
import type { IUserRepository } from '../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  // TODO: Inject Prisma/TypeORM
  // constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    // TODO: Implement database query
    return null;
  }

  async findAll(): Promise<UserEntity[]> {
    // TODO: Implement database query
    return [];
  }

  async create(user: UserEntity): Promise<UserEntity> {
    // TODO: Implement database insert
    return user;
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    // TODO: Implement database update
    return new UserEntity(user);
  }

  async delete(id: string): Promise<void> {
    // TODO: Implement database delete
  }
}
