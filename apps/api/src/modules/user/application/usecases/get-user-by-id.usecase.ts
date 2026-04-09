// Use-case: Get User By ID
import type { UserEntity } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }
}
