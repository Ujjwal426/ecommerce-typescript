import CategoryModel from '../models/category.model';
import slugify from 'slugify';
import { Category } from '../interfaces/category.interface';
import { isEmpty } from '../utils/empty';
import { HttpException } from '../exceptions/HttpException';
import SubCategoryModel from '../models/sub.category.model';

class CategoryService {
  public categoryModel = CategoryModel;
  public subCategoryModel = SubCategoryModel;

  public createCategory = async (categoryName: string): Promise<Category> => {
    if (isEmpty(categoryName)) throw new HttpException(400, 'Please provide a category name');
    const slug = slugify(categoryName);
    const isCategoryExist = await this.categoryModel.findOne({ slug });
    if (isCategoryExist) {
      throw new HttpException(400, 'Category already exist');
    }
    const category = await this.categoryModel.create({ name: categoryName, slug });
    return category;
  };

  public getCategories = async (): Promise<Category[]> => {
    const categories = await this.categoryModel.find();
    return categories;
  };

  public getCategory = async (slug: string): Promise<Category> => {
    if (isEmpty(slug)) throw new HttpException(400, 'Please provide a valid category name');
    const category = await this.categoryModel.findOne({ slug });
    if (!category) {
      throw new HttpException(400, 'Category does not exist');
    }
    return category;
  };

  public updateCategory = async (categoryName: string, slug: string): Promise<Category> => {
    if (isEmpty(slug)) throw new HttpException(400, 'Please provide a valid category name');
    if (isEmpty(categoryName)) throw new HttpException(400, 'Please provide a update category name');
    const category = await this.categoryModel.findOne({ slug: slugify(categoryName) });
    if (category) {
      throw new HttpException(400, 'Category already exist');
    }
    const updatedCategory = await this.categoryModel.findOneAndUpdate(
      { slug },
      { name: categoryName, slug: slugify(categoryName) },
      {
        new: true,
      },
    );
    if (!updatedCategory) {
      throw new HttpException(400, 'Updated category does not exist');
    }
    return updatedCategory;
  };

  public deleteCategory = async (slug: string): Promise<Category> => {
    if (isEmpty(slug)) throw new HttpException(400, 'Category does not exist');
    const deletedCategory = await this.categoryModel.findOneAndDelete({ slug });
    if (!deletedCategory) {
      throw new HttpException(400, 'Category does not exist');
    }
    const deletedSubCategory = await this.subCategoryModel.findByIdAndDelete({ _id: deletedCategory._id });
    return deletedCategory;
  };
}

export default CategoryService;
