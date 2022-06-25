import { Router } from 'express';
import { SubCategoryController } from '../controllers/sub.category.controller';
import { SubCategoryDto } from '../dtos/subcategory.dto';
import { Routes } from '../interfaces/routes.interface';
import validationError from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';

class SubCategoryRoute implements Routes {
  public path = '/subcategory';
  public router = Router();
  public subCategoryController = new SubCategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/:id`, authMiddleware, validationError(SubCategoryDto, 'body'), this.subCategoryController.createSubCategory);
    this.router.get(`${this.path}/getAll`, authMiddleware, this.subCategoryController.getSubCategories);
    this.router.get(`${this.path}/:slug`, authMiddleware, this.subCategoryController.getSubCategory);
    this.router.post(
      `${this.path}/update/:slug`,
      authMiddleware,
      validationError(SubCategoryDto, 'body'),
      this.subCategoryController.updateSubCategory,
    );
    this.router.delete(`${this.path}/delete/:slug`, authMiddleware, this.subCategoryController.deleteSubCategory);
    this.router.get(`${this.path}/category`, authMiddleware, this.subCategoryController.getSubCategoryByCategory);
  }
}

export default SubCategoryRoute;
