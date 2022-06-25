import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { Routes } from '../interfaces/routes.interface';
import { ProductDto } from '../dtos/product.dto';
import validationError from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';

class ProductRoute implements Routes {
  public path = '/product';
  public router = Router();
  public productController = new ProductController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, validationError(ProductDto, 'body', true, false), this.productController.createProduct);
    this.router.delete(`${this.path}/:slug`, authMiddleware, this.productController.deleteProduct);
    this.router.get(`${this.path}/all`, authMiddleware, this.productController.getProducts);
    this.router.get(`${this.path}/:id`, authMiddleware, this.productController.getProduct);
    this.router.get(`${this.path}/category/:id`, authMiddleware, this.productController.getCategoryWithProduct);
    this.router.get(`${this.path}/subcategory/:id`, authMiddleware, this.productController.getSubCategoryWithProduct);
    this.router.post(`${this.path}/search`, authMiddleware, this.productController.searchFilters);
  }
}

export default ProductRoute;
