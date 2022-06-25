import { Request, Response, NextFunction } from 'express';
import { Category } from '../interfaces/category.interface';
import CategoryService from '../services/category.service';

export class CategoryController {
  public categoryService = new CategoryService();

  public createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryName: string = req.body.name;
      const category: Category = await this.categoryService.createCategory(categoryName);
      res.status(200).json({
        data: category,
        message: 'Category created',
      });
    } catch (error) {
      next(error);
    }
  };

  public getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories: Category[] = await this.categoryService.getCategories();
      res.status(200).json({ data: categories, message: 'List of all categories' });
    } catch (error) {
      next(error);
    }
  };

  public getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug: string = req.params.slug;
      const category = await this.categoryService.getCategory(slug);
      res.status(200).json({ data: category, message: 'Category Details' });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name: string = req.body.name;
      const slug: string = req.params.slug;
      const updatedCategory: Category = await this.categoryService.updateCategory(name, slug);
      res.status(200).json({
        data: updatedCategory,
        message: 'Category update successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug: string = req.params.slug;
      const deletedCategory = await this.categoryService.deleteCategory(slug);
      res.status(200).json({ data: deletedCategory, message: 'Deleted category successfully' });
    } catch (error) {
      next(error);
    }
  };
}
