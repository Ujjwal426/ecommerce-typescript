import { Schema, model } from 'mongoose';
import { Brand } from '../interfaces/brand.interface';

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<Brand>('Brand', brandSchema);
