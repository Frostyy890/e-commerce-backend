import { IsEmail, IsNotEmpty } from 'class-validator';

export class userEmailDto {
  @IsEmail()
  email: string;
}
