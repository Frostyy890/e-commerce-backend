import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async getAll() {
    const users = await this.userModel.find().exec();
    return users.map((user) => ({
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      phone: user.phone,
      email: user.email,
      password: user.password,
      role: user.role,
      isActive: user.isActive,
    }));
  }

  async getById(id: string) {}

  async create(userData: createUserDto) {
    const { email, phone } = userData;
    const newUser = new this.userModel(userData);
    const userInDb = await this.userModel
      .findOne()
      .or([{ email }, { phone }])
      .exec();
    if (userInDb) {
      throw new ConflictException(
        'User with this email or phone already exists',
      );
    }
    await newUser.save();
    return newUser;
  }
}
