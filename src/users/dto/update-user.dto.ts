import { IsOptional, ValidateIf } from 'class-validator';
import { createUserDto } from './create-user.dto';

export class updateUserDto extends createUserDto {
  @ValidateIf((object, value) => value !== undefined)
  @IsOptional()
  fname: string;
  @ValidateIf((object, value) => value !== undefined)
  @IsOptional()
  lname: string;
  @ValidateIf((object, value) => value !== undefined)
  @IsOptional()
  phone: string;
  @ValidateIf((object, value) => value !== undefined)
  @IsOptional()
  email: string;
  @ValidateIf((object, value) => value !== undefined)
  @IsOptional()
  password: string;
}
