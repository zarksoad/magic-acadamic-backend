import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class loginAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
