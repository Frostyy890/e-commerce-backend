import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { loginDto } from './dto/login.dto';
import { validatePassword } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signUp(userData: createUserDto) {
    const newUser = await this.usersService.create({
      ...userData,
      isActive: true,
    });
    const payload = { sub: newUser._id };
    let access_token: string;
    try {
      access_token = await this.jwtService.signAsync(payload);
    } catch (err) {
      console.error(err);
    }
    return { message: 'Successfully signed up', user: newUser, access_token };
  }
  async login(userData: loginDto) {
    const { email, password } = userData;
    const userInDb = await this.usersService.getByEmail(email);
    const isPasswordMatch = await validatePassword(password, userInDb.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Password');
    }
    const payload = { sub: userInDb._id };
    let access_token: string;
    try {
      access_token = await this.jwtService.signAsync(payload);
    } catch (err) {
      console.error(err);
    }
    return { message: 'Successfully logged in', access_token };
  }
}
