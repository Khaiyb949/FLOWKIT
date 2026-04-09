// Auth Module: DI Configuration
import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthApplicationService } from './application/auth.application.service';
import { AuthRepository } from './infrastructure/auth.repository';
import { IAuthRepository } from './domain/repositories/auth.repository.interface';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    {
      provide: AuthApplicationService,
      useFactory: (authRepository: IAuthRepository) =>
        new AuthApplicationService(authRepository),
      inject: ['IAuthRepository'],
    },
  ],
  exports: [AuthApplicationService],
})
export class AuthModule {}
