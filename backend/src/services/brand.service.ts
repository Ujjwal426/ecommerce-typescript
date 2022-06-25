import BrandModel from '../models/brand.model';
import slugify from 'slugify';
import { Brand } from '../interfaces/brand.interface';
import { isEmpty } from '../utils/empty';
import { HttpException } from '../exceptions/HttpException';

class BrandService {
  public brandModel = BrandModel;

  public createBrand = async (name: string): Promise<Brand> => {
    if (isEmpty(name)) throw new HttpException(400, 'Please provide a valid brand name');
    const slug = slugify(name);
    const isBrandExist = await this.brandModel.findOne({ slug });
    if (isBrandExist) {
      throw new HttpException(400, 'Please peovide a unique brand name');
    }
    const brand = await this.brandModel.create({ name, slug });
    return brand;
  };

  public getBrands = async (): Promise<Brand[]> => {
    const brands = await this.brandModel.find();
    return brands;
  };

  public getBrand = async (slug: string): Promise<Brand> => {
    if (isEmpty(slug)) throw new HttpException(400, 'Brand does not exist');
    const brand = await this.brandModel.findOne({ slug });
    if (!brand) {
      throw new HttpException(400, 'Brand does not exist');
    }
    return brand;
  };

  public updateBrand = async (slug: string, brandName: string): Promise<Brand> => {
    if (isEmpty(slug)) throw new HttpException(400, 'Brand does not exist');
    if (isEmpty(brandName)) throw new HttpException(400, 'Please provide a valid brand name');
    const brand = await this.brandModel.findOne({ slug: slugify(brandName) });
    if (brand) {
      throw new HttpException(400, 'Please provide a unique brand name');
    }
    const updatedBrand = await this.brandModel.findOneAndUpdate(
      { slug },
      { name: brandName, slug: slugify(brandName) },
      {
        new: true,
      },
    );
    if (!updatedBrand) {
      throw new HttpException(400, 'Brand does not exist');
    }
    return updatedBrand;
  };

  public deleteBrand = async (slug: string): Promise<Brand> => {
    if (isEmpty(slug)) throw new HttpException(400, 'Brand does not exist');
    const deletedBrand = await this.brandModel.findOneAndDelete({ slug });
    if (!deletedBrand) {
      throw new HttpException(400, 'Brand does not exist');
    }
    return deletedBrand;
  };
}

export default BrandService;
