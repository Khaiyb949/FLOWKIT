// Presentation: Controller
import { Controller, Post, Body } from '@nestjs/common';
import { AuthApplicationService } from '../../application/auth.application.service';
import { LoginDto, RegisterDto, AuthResponseDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthApplicationService) {}

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const result = await this.authService.login(dto.email, dto.password);
    return {
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
      },
    };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.authService.register(dto.email, dto.password);
    return {
      token: 'new-token',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
