import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
export class createUserDto {
  // First Name
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  readonly fname: string;
  // Last Name
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  readonly lname: string;
  //  Phone
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phone: string;
  // Email
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  readonly email: string;
  // Password
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
