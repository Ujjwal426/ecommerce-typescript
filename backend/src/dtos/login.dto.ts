import { IsEmail, IsString } from 'class-validator';

export class loginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
