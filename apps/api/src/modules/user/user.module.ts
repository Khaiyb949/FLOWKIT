// User Module
import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { UserApplicationService } from './application/user.application.service';
import { UserRepository } from './infrastructure/user.repository';
import { IUserRepository } from './domain/repositories/user.repository.interface';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: UserApplicationService,
      useFactory: (userRepository: IUserRepository) =>
        new UserApplicationService(userRepository),
      inject: ['IUserRepository'],
    },
  ],
  exports: [UserApplicationService],
})
export class UserModule {}
