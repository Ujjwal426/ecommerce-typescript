import { Schema, model } from 'mongoose';
import { Rating } from '../interfaces/rating.interface';

const ratingSchema = new Schema(
  {
    star: {
      type: Number,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export default model<Rating>('Rating', ratingSchema);
