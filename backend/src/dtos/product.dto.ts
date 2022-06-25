import { IsString, Length, MaxLength, IsNumber, IsNumberString } from 'class-validator';

export class ProductDto {
  @IsString()
  @Length(2, 32)
  public title: string;
  @IsString()
  @MaxLength(2000)
  public description: string;

  @IsNumberString()
  @MaxLength(32)
  public price: number;

  @IsNumberString()
  public quantity: number;

  public categoryId: string;
  public subCategoryId: string;
  public brandId: string;
}
