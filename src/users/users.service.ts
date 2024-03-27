import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

export interface successMessage {
  message: string;
  timestamp: string;
}

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

  async getById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    } else
      return {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        phone: user.phone,
        email: user.email,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
      };
  }

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

  async update(id: string, changes: updateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const user = await this.userModel.findById(id).exec();
    const { phone, email } = changes;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userInDb = await this.userModel
      .findOne()
      .or([{ email }, { phone }])
      .exec();
    if (userInDb && userInDb._id.toString() !== id) {
      throw new ConflictException(
        'User with this email or phone already exists',
      );
    }
    const isChanged = Object.keys(changes).some(
      (key) => user[key] !== changes[key],
    );
    await this.userModel.findByIdAndUpdate(id, changes).exec();
    return {
      message: isChanged ? 'Successfully updated user' : 'Nothing to update',
      timestamp: new Date().toISOString(),
    };
  }

  async delete(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const result = await this.userModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'Successfully deleted user',
      timestamp: new Date().toISOString(),
    };
  }
}
