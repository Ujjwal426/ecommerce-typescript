import { IsString, Length } from 'class-validator';

export class SubCategoryDto {
  @IsString()
  @Length(2, 30)
  public name: string;
}
