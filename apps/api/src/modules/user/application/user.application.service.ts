// Application Service
import { Injectable } from '@nestjs/common';
import { GetAllUsersUseCase } from './usecases/get-all-users.usecase';
import { GetUserByIdUseCase } from './usecases/get-user-by-id.usecase';
import type { IUserRepository } from '../domain/repositories/user.repository.interface';

@Injectable()
export class UserApplicationService {
  private getAllUsersUseCase: GetAllUsersUseCase;
  private getUserByIdUseCase: GetUserByIdUseCase;

  constructor(userRepository: IUserRepository) {
    this.getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
    this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  }

  getAllUsers() {
    return this.getAllUsersUseCase.execute();
  }

  getUserById(id: string) {
    return this.getUserByIdUseCase.execute(id);
  }
}
