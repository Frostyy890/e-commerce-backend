import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async getAll() {
    try {
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
    } catch (err) {
      console.error(err);
    }
  }

  async getById(id: string) {
    try {
    } catch (err) {
      console.error(err);
    }
  }

  async create(userData: createUserDto) {
    try {
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
    } catch (err) {
      console.error(err);
    }
  }
}
