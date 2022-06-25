import { Schema, model } from 'mongoose';
import { SubCategory } from '../interfaces/sub.category.interface';

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<SubCategory>('SubCategory', subCategorySchema);
