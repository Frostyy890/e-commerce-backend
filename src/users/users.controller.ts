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
import { userEmailDto } from './dto/user-email.dto';
import { Public } from 'src/common/custom-decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}
  @Public()
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.UserService.getAll();
  }

  @Get('by-email/:email')
  async getUserByEmail(@Param() params: userEmailDto): Promise<User> {
    return this.UserService.getByEmail(params.email);
  }

  @Get(':id')
  // @UseGuards(AuthGuard)
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
