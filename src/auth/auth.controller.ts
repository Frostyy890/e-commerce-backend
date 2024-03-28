import { Body, Controller, Post } from '@nestjs/common';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { User } from 'src/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-up')
  async signUp(
    @Body() userData: createUserDto,
  ): Promise<{ message: string; user: User; access_token: string }> {
    return this.authService.signUp(userData);
  }
  @Post('login')
  async login(
    @Body() userData: loginDto,
  ): Promise<{ message: string; access_token: string }> {
    return this.authService.login(userData);
  }
}
