// Use-case: Login
import type { AuthEntity } from '../../domain/entities/auth.entity';
import type { IAuthRepository } from '../../domain/repositories/auth.repository.interface';

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string, password: string): Promise<{
    token: string;
    user: AuthEntity;
  }> {
    // 1. Find user by email
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 2. Validate password
    if (!user.isPasswordValid(password)) {
      throw new Error('Invalid credentials');
    }

    // 3. Generate token (delegate to another service)
    const token = 'generated-jwt-token'; // TODO: Call JWT service

    return { token, user };
  }
}
