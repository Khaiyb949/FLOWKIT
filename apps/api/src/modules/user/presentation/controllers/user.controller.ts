// Presentation: Controller
import { Controller, Get, Param } from '@nestjs/common';
import { UserApplicationService } from '../../application/user.application.service';
import { UserResponseDto } from '../dtos/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserApplicationService) {}

  @Get()
  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.userService.getAllUsers();
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }));
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
