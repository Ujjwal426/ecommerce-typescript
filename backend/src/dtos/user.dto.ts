import { IsEmail, IsNumberString, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @Length(3, 20)
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsNumberString()
  @Length(10)
  public phone: string;
}
