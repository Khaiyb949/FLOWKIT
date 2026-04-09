// Infrastructure: Repository Implementation
import { Injectable } from '@nestjs/common';
import { AuthEntity } from '../domain/entities/auth.entity';
import type { IAuthRepository } from '../domain/repositories/auth.repository.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  // TODO: Inject Prisma/TypeORM
  // constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthEntity | null> {
    // TODO: Implement database query
    // const model = await this.prisma.auth.findUnique({ where: { email } });
    // return model ? new AuthEntity(model) : null;
    return null;
  }

  async findById(id: string): Promise<AuthEntity | null> {
    // TODO: Implement database query
    return null;
  }

  async create(auth: AuthEntity): Promise<AuthEntity> {
    // TODO: Implement database insert
    return auth;
  }

  async update(id: string, auth: Partial<AuthEntity>): Promise<AuthEntity> {
    // TODO: Implement database update
    return new AuthEntity(auth);
  }

  async delete(id: string): Promise<void> {
    // TODO: Implement database delete
  }
}
