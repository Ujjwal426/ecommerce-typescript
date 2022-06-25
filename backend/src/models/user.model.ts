import { User } from '../interfaces/user.interface';
import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 10,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
  },
});

export default model<User>('User', userSchema);
