import { Request, Response, NextFunction } from 'express';
import SubCategoryService from '../services/sub.category.service';
import { SubCategory } from '../interfaces/sub.category.interface';

export class SubCategoryController {
  public subCategoryService = new SubCategoryService();

  public createSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId: string = req.params.id;
      const name: string = req.body.name;
      const createSubCategory: SubCategory = await this.subCategoryService.createSubCategory(name, parentId);
      res.status(200).json({ data: createSubCategory, message: 'Subcategory created' });
    } catch (error) {
      next(error);
    }
  };

  public getSubCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subCategories: SubCategory[] = await this.subCategoryService.getSubCategories();
      res.status(200).json({ data: subCategories, message: 'List of all subcategories' });
    } catch (error) {
      next(error);
    }
  };

  public getSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug: string = req.params.slug;
      const subCategory: SubCategory = await this.subCategoryService.getSubCategory(slug);
      res.status(200).json({ data: subCategory, message: 'Subcategory Details' });
    } catch (error) {
      next(error);
    }
  };

  public updateSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name: string = req.body.name;
      const slug: string = req.params.slug;
      const updatedSubCategory: SubCategory = await this.subCategoryService.updateSubCategory(name, slug);
      res.status(200).json({ data: updatedSubCategory, message: 'Update category successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug: string = req.params.slug;
      const deletedCategory = await this.subCategoryService.deleteSubCategory(slug);
      res.status(200).json({ data: deletedCategory, message: 'Deleted category successfully' });
    } catch (error) {
      next(error);
    }
  };
  public getSubCategoryByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug: string = req.params.slug;
      const subCategories = await this.subCategoryService.getSubCategoryByCategory(slug);
      res.status(200).json({ data: subCategories, message: 'List of all subcategories by category' });
    } catch (error) {
      next(error);
    }
  };
}
