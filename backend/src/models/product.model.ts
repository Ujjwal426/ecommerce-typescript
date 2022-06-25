import { Schema, model } from 'mongoose';
import { Product } from '../interfaces/product.interface';

const productSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    subCategoryId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      required: true,
      default: 0,
    },
    images: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      enum: ['Black', 'Brown', 'Silver', 'Gold', 'Blue'],
    },
  },
  {
    timestamps: true,
  },
);

export default model<Product>('Product', productSchema);
