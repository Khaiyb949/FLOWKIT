// Repository Interface - Abstract data access contract
import type { AuthEntity } from '../entities/auth.entity';

export interface IAuthRepository {
  findByEmail(email: string): Promise<AuthEntity | null>;
  findById(id: string): Promise<AuthEntity | null>;
  create(auth: AuthEntity): Promise<AuthEntity>;
  update(id: string, auth: Partial<AuthEntity>): Promise<AuthEntity>;
  delete(id: string): Promise<void>;
}
