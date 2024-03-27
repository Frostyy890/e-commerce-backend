import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService, successMessage } from './users.service';
import { User } from 'src/schemas/user.schema';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

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

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() changes: updateUserDto,
  ): Promise<successMessage> {
    return this.UserService.update(id, changes);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<successMessage> {
    return this.UserService.delete(id);
  }
}
