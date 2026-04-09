// Use-case: Register
import { AuthEntity } from '../../domain/entities/auth.entity';
import type { IAuthRepository } from '../../domain/repositories/auth.repository.interface';

export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string, password: string): Promise<AuthEntity> {
    // 1. Check if user exists
    const existing = await this.authRepository.findByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }

    // 2. Hash password (delegate to another service)
    const hashedPassword = 'hashed-password'; // TODO: Call crypto service

    // 3. Create user
    const user = new AuthEntity({
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.authRepository.create(user);
  }
}
