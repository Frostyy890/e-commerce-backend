import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';
export class loginDto {
  // Email
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  readonly email: string;
  // Password
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(8)
  readonly password: string;
}
