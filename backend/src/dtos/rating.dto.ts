import { IsNumberString, IsString, Length } from 'class-validator';

export class RatingDto {
  @IsNumberString()
  @Length(1, 1)
  public star: number;

  productId: string;
  userId: string;
}
