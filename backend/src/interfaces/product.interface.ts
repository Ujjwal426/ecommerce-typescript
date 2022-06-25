export interface Product {
  title: string;
  slug: string;
  description: string;
  price: Number;
  quantity: number;
  images: string[];
  categoryId: string;
  subCategoryId: string;
  brandId: string;
  ratings: Object[];
}
