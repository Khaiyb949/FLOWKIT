// Application Service: Orchestrate use-cases
import { Injectable } from '@nestjs/common';
import { LoginUseCase } from './usecases/login.usecase';
import { RegisterUseCase } from './usecases/register.usecase';
import type { IAuthRepository } from '../domain/repositories/auth.repository.interface';

@Injectable()
export class AuthApplicationService {
  private loginUseCase: LoginUseCase;
  private registerUseCase: RegisterUseCase;

  constructor(authRepository: IAuthRepository) {
    this.loginUseCase = new LoginUseCase(authRepository);
    this.registerUseCase = new RegisterUseCase(authRepository);
  }

  login(email: string, password: string) {
    return this.loginUseCase.execute(email, password);
  }

  register(email: string, password: string) {
    return this.registerUseCase.execute(email, password);
  }
}
