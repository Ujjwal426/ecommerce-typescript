import { Router } from 'express';
import { BrandController } from '../controllers/brand.controller';
import { CategoryDto } from '../dtos/category.dto';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import validationError from '../middlewares/validation.middleware';

class BrandRoute implements Routes {
  public path = '/brand';
  public router = Router();
  public brandController = new BrandController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, authMiddleware, validationError(CategoryDto, 'body'), this.brandController.createBrand);
    this.router.get(`${this.path}/brands`, authMiddleware, this.brandController.getBrands);
    this.router.get(`${this.path}/:slug`, authMiddleware, this.brandController.getBrand);
    this.router.post(`${this.path}/:slug`, authMiddleware, validationError(CategoryDto, 'body'), this.brandController.updateBrand);
    this.router.delete(`${this.path}/:slug`, authMiddleware, this.brandController.deleteBrand);
  }
}

export default BrandRoute;
