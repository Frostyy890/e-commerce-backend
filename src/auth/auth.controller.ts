import { Body, Controller, Post, Res } from '@nestjs/common';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-up')
  async signUp(
    @Body() userData: createUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const { user, message, access_token } =
      await this.authService.signUp(userData);
    res.cookie('token', access_token, { httpOnly: true });
    res.status(201).send({ message, user });
  }
  @Post('login')
  async login(@Body() userData: loginDto, @Res() res: Response): Promise<void> {
    const { message, access_token } = await this.authService.login(userData);
    res.cookie('token', access_token, { httpOnly: true });
    res.status(200).send({ message });
  }
}
