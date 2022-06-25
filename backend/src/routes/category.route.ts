import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { CategoryDto } from '../dtos/category.dto';
import { Routes } from '../interfaces/routes.interface';
import validationError from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';

class CategoryRoute implements Routes {
  public path = '/category';
  public router = Router();
  public categoryController = new CategoryController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}/create`, authMiddleware, validationError(CategoryDto, 'body'), this.categoryController.createCategory);
    this.router.get(`${this.path}/categories`, authMiddleware, this.categoryController.getCategories);
    this.router.get(`${this.path}/:slug`, authMiddleware, this.categoryController.getCategory);
    this.router.post(`${this.path}/:slug`, authMiddleware, validationError(CategoryDto, 'body'), this.categoryController.updateCategory);
    this.router.delete(`${this.path}/:slug`, authMiddleware, this.categoryController.deleteCategory);
  }
}

export default CategoryRoute;
