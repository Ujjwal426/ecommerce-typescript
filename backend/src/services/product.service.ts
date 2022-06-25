import aws from 'aws-sdk';
import 'dotenv/config';
import { HttpException } from '../exceptions/HttpException';
import { UploadedFile } from 'express-fileupload';
import ProductModel from '../models/product.model';
import slugify from 'slugify';
import { Product } from '../interfaces/product.interface';
import { isEmpty } from '../utils/empty';
import CategoryModel from '../models/category.model';
import SubCategoryModel from '../models/sub.category.model';
import BrandModel from '../models/brand.model';

class ProductService {
  public productModel = ProductModel;
  public categoryModel = CategoryModel;
  public subCategoryModel = SubCategoryModel;
  public brandModel = BrandModel;

  public s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  public uploadFilesToAws = async (file: UploadedFile): Promise<string> => {
    const fileName = `${new Date().getTime()}_${file.name}`;
    const mimetype = file.mimetype;
    const params: aws.S3.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: file.data,
      ContentType: mimetype,
      ACL: 'public-read',
    };
    const res = await new Promise((resolve, reject) => {
      this.s3.upload(params, (err: any, data: any) => (err == null ? resolve(data) : reject(err)));
    });
    return fileName;
  };
  public deleteFilesToAws = async (url: string) => {
    console.log(url);
    const params: aws.S3.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: url,
    };
    await this.s3
      .deleteObject(params, (err: any, data: any) => {
        if (err) console.log(err);
        else console.log('Successfully deleted file from bucket');
      })
      .promise();
  };

  public createProduct = async (files: UploadedFile[], productData: Product): Promise<Product> => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].mimetype.split('/')[1] !== 'jpeg') throw new HttpException(400, 'Please select a image type');
    }

    if (isEmpty(productData.categoryId)) throw new HttpException(400, 'Please provide a product category');
    const isCategoryExist = await this.categoryModel.findById({ _id: productData.categoryId });
    if (!isCategoryExist) throw new HttpException(400, 'Please provide a product category');

    if (isEmpty(productData.subCategoryId)) throw new HttpException(400, 'Please provide a product subcategory');
    const isSubCategoryExist = await this.subCategoryModel.findById({ _id: productData.subCategoryId });
    if (!isSubCategoryExist) throw new HttpException(400, 'Please provide a product subcategory');

    if (isEmpty(productData.brandId)) throw new HttpException(400, 'Please provide a product brand');
    const isBrandExist = await this.brandModel.findById({ _id: productData.brandId });
    if (!isBrandExist) throw new HttpException(400, 'Please provide a product brand');

    const isProductExist = await this.productModel.findOne({ slug: slugify(productData.title) });
    if (isProductExist) throw new HttpException(400, 'Please provide a unique product name');

    let url: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const location: string = await this.uploadFilesToAws(files[i]);
      url.push(location);
    }
    const newProduct = await this.productModel.create({
      title: productData.title,
      slug: slugify(productData.title),
      description: productData.description,
      price: productData.price,
      quantity: productData.quantity,
      images: url,
      categoryId: productData.categoryId,
      subCategoryId: productData.subCategoryId,
      brandId: productData.brandId,
    });
    return newProduct;
  };

  public deleteProduct = async (slug: string): Promise<Product> => {
    if (isEmpty(slug)) throw new HttpException(400, 'Please provide a product value');
    const deletedProduct: Product = await this.productModel.findOneAndDelete({ slug });
    if (!deletedProduct) {
      throw new HttpException(400, 'Product does not exist');
    }
    const files = deletedProduct.images;
    for (let i = 0; i < files.length; i++) {
      await this.deleteFilesToAws(files[i]);
    }
    return deletedProduct;
  };

  public getProducts = async (): Promise<Product[]> => {
    const products = await this.productModel.find();
    return products;
  };

  public getProduct = async (_id: string): Promise<Product> => {
    if (isEmpty(_id)) throw new HttpException(400, 'Product does not exist');
    const isProductExist = await this.productModel.findOne({ _id });
    if (!isProductExist) throw new HttpException(400, 'Product does not exist');
    return isProductExist;
  };

  public getCategoryWithProduct = async (categoryId: string): Promise<Product[]> => {
    if (isEmpty(categoryId)) throw new HttpException(400, 'Product does not exist');
    const isCategoryExist = await this.categoryModel.findById({ _id: categoryId });
    if (!isCategoryExist) throw new HttpException(400, 'Product does not exist');
    const products = await this.productModel.find({ categoryId });
    return products;
  };

  public getSubCategoryWithProduct = async (subCategoryId: string): Promise<Product[]> => {
    if (isEmpty(subCategoryId)) throw new HttpException(400, 'Product does not exist');
    const isSubCategoryExist = await this.subCategoryModel.findById({ _id: subCategoryId });
    if (!isSubCategoryExist) throw new HttpException(400, 'Product does not exist');
    const products = await this.productModel.find({ subCategoryId });
    return products;
  };

  private handleQuery = async (query: string): Promise<Product[]> => {
    const products: Product[] = await this.productModel.find({
      $or: [
        {
          title: { $regex: query },
        },
        {
          slug: { $regex: query },
        },
        {
          description: { $regex: query },
        },
      ],
    });
    return products;
  };

  private handlePrice = async (price: number[]): Promise<Product[]> => {
    const products = await this.productModel.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    });
    return products;
  };

  private handleCategory = async (categoryId: string): Promise<Product[]> => {
    const products = await this.productModel.find({ categoryId });
    return products;
  };

  public searchFilters = async (reqBody: any): Promise<Product[]> => {
    const { query, price, categoryId } = reqBody;
    if (query) {
      if (isEmpty(query)) throw new HttpException(400, 'Page not found');
      return await this.handleQuery(query);
    }

    //price[100, 1000]
    if (price != undefined) {
      if (price[0] < 0 || price[1] < 0) throw new HttpException(400, 'price should be positive');
      return await this.handlePrice(price);
    }

    if (categoryId != undefined) {
      if (isEmpty(categoryId)) throw new HttpException(400, 'Please enter a valid category');
      return await this.handleCategory(categoryId);
    }
  };
}

export default ProductService;
