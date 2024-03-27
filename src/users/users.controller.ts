import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-user.dto';
import { User } from 'src/schemas/user.schema';
import { ObjectId } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.UserService.getAll();
  }
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.UserService.getById(id);
  }
  @Post()
  async createUser(@Body() userData: createUserDto): Promise<User> {
    return this.UserService.create(userData);
  }
}
