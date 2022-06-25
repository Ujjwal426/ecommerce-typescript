import ProductService from '../services/product.service';
import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';
import { HttpException } from '../exceptions/HttpException';
import { Product } from '../interfaces/product.interface';

export class ProductController {
  public productService = new ProductService();

  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !req.files.images) {
        throw new HttpException(400, 'Please upload images...');
      }
      console.log(req.body);
      const file = req.files.images as UploadedFile[];
      if (file.length === undefined) {
        throw new HttpException(400, 'Please upload multiple file');
      }
      const reqBody = req.body;
      const product: Product = await this.productService.createProduct(file, reqBody);
      res.status(200).json({ data: product, message: 'Product created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const deletedProduct: Product = await this.productService.deleteProduct(slug);
      res.status(200).json({ data: deletedProduct, message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productList: Product[] = await this.productService.getProducts();
      res.status(200).json({ data: productList, message: 'List of all products' });
    } catch (error) {
      next(error);
    }
  };
  public getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;
      const productList: Product = await this.productService.getProduct(productId);
      res.status(200).json({ data: productList, message: 'Product Details' });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryWithProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = req.params.id;
      const products: Product[] = await this.productService.getCategoryWithProduct(categoryId);
      res.status(200).json({ data: products, message: 'List of product with category' });
    } catch (error) {
      next(error);
    }
  };

  public getSubCategoryWithProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subCategoryId = req.params.id;
      const products: Product[] = await this.productService.getSubCategoryWithProduct(subCategoryId);
      res.status(200).json({ data: products, message: 'List of product with category' });
    } catch (error) {
      next(error);
    }
  };

  public searchFilters = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products: Product[] = await this.productService.searchFilters(req.body);
      res.status(200).json({ data: products, message: 'Products Displayed' });
    } catch (error) {
      next(error);
    }
  };
}
