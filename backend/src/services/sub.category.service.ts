import CategoryModel from '../models/category.model';
import SubCategoryModel from '../models/sub.category.model';
import slugify from 'slugify';
import { SubCategory } from '../interfaces/sub.category.interface';
import { HttpException } from '../exceptions/HttpException';
import { isEmpty } from '../utils/empty';

class SubCategoryService {
  public categoryModel = CategoryModel;
  public subCategoryModel = SubCategoryModel;

  public createSubCategory = async (subCategoryName: string, parentId: string): Promise<SubCategory> => {
    if (isEmpty(subCategoryName)) throw new HttpException(400, 'Please provide a subcategory name');
    if (isEmpty(parentId)) throw new HttpException(400, 'Please provide a valid category name');
    const isCategoryExist = await this.categoryModel.findById({ _id: parentId });
    if (!isCategoryExist) {
      throw new HttpException(400, 'Parent category does not exist');
    }
    const slug = slugify(subCategoryName);
    const isSubCategoryExist = await this.subCategoryModel.findOne({ slug });
    if (isSubCategoryExist) {
      throw new HttpException(400, 'Subcategory already exist');
    }
    const createSubCategory = await this.subCategoryModel.create({ name: subCategoryName, slug, parentId: isCategoryExist._id });
    // console.log(createSubCategory);
    return createSubCategory;
  };

  public getSubCategories = async (): Promise<SubCategory[]> => {
    const subCategories = await this.subCategoryModel.find();
    return subCategories;
  };

  public getSubCategory = async (slug: string): Promise<SubCategory> => {
    if (isEmpty(slug)) throw new HttpException(400, 'Subcategory does not exist');
    const subCategory = await this.subCategoryModel.findOne({ slug });
    if (!subCategory) {
      throw new HttpException(400, 'Subcategory does not exist');
    }
    return subCategory;
  };

  public updateSubCategory = async (subCategoryName: string, slug: string): Promise<SubCategory> => {
    if (isEmpty(subCategoryName)) throw new HttpException(400, 'Please provide a valid subcategory name');
    if (isEmpty(slug)) throw new HttpException(400, 'SubCategory does not exist');
    const subCategory = await this.subCategoryModel.findOne({ slug: slugify(subCategoryName) });
    if (subCategory) {
      throw new HttpException(400, 'Subcategory already exist');
    }
    const updatedCategory = await this.subCategoryModel.findOneAndUpdate(
      { slug },
      { name: subCategoryName, slug: slugify(subCategoryName) },
      {
        new: true,
      },
    );
    if (!updatedCategory) {
      throw new HttpException(400, 'Update category does not exist');
    }
    return updatedCategory;
  };

  public deleteSubCategory = async (slug: string): Promise<SubCategory> => {
    if (isEmpty(slug)) throw new HttpException(400, 'Subcategory does not exist');
    const deletedCategory = await this.subCategoryModel.findOneAndDelete({ slug });
    if (!deletedCategory) {
      throw new HttpException(400, 'Subcategory does not exist');
    }
    return deletedCategory;
  };

  public getSubCategoryByCategory = async (slug: string): Promise<SubCategory[]> => {
    if (isEmpty(slug)) throw new HttpException(400, 'Category does not exist');
    const category = await this.categoryModel.findOne({ slug });
    if (!category) {
      throw new HttpException(400, 'Category does not exist');
    }
    const subCategories = await this.subCategoryModel.find({ parentId: category._id });
    return subCategories;
  };
}

export default SubCategoryService;
