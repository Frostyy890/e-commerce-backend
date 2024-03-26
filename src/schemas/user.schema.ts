import * as mongoose from 'mongoose';
import { hash, genSalt, compare } from 'bcrypt';

export interface User {
  _id: string;
  fname: string;
  lname: string;
  phone: string;
  email: string;
  password: string;
  role?: 'Admin' | 'Manager' | 'User';
  isActive?: boolean;
}

export const UserSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Manager', 'User'], default: 'User' },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true },
);
const SALT_WORK_FACTOR = 10;
//Hashing password
UserSchema.pre('save', async function save(next) {
  //Hashing only if password is updated or the new one is created
  if (!this.isModified('password')) return next();
  try {
    const salt = await genSalt(SALT_WORK_FACTOR);
    this.password = await hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(
  password: string,
): Promise<boolean> {
  return compare(password, this.password);
};
