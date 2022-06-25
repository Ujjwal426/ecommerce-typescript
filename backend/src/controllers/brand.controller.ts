import { Request, Response, NextFunction } from 'express';
import { Brand } from '../interfaces/brand.interface';
import BrandService from '../services/brand.service';

export class BrandController {
  public brandService = new BrandService();

  public createBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brandName: string = req.body.name;
      const createdBrand: Brand = await this.brandService.createBrand(brandName);
      res.status(200).json({ data: createdBrand, message: 'Brand Created' });
    } catch (error) {
      next(error);
    }
  };

  public getBrands = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brands: Brand[] = await this.brandService.getBrands();
      res.status(200).json({
        data: brands,
        message: 'List of all brans',
      });
    } catch (error) {
      next(error);
    }
  };

  public getBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug: string = req.params.slug;
      const brand: Brand = await this.brandService.getBrand(slug);
      res.status(200).json({
        data: brand,
        message: 'Brand Details',
      });
    } catch (error) {
      next(error);
    }
  };

  public updateBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug: string = req.params.slug;
      const brandName: string = req.body.name;
      const updatedBrand = await this.brandService.updateBrand(slug, brandName);
      res.status(200).json({ data: updatedBrand, message: 'Brand updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug: string = req.params.slug;
      const deletedBrand: Brand = await this.brandService.deleteBrand(slug);
      res.status(200).json({ data: deletedBrand, message: 'Brand deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
