import RatingModel from '../models/rating.model';
import { Rating } from '../interfaces/rating.interface';
import { isEmpty } from '../utils/empty';
import { HttpException } from '../exceptions/HttpException';
import ProductModel from '../models/product.model';
import UserModel from '../models/user.model';

class RatingService {
  public ratingModel = RatingModel;
  public productModel = ProductModel;
  public userModel = UserModel;
  public createRating = async (star: number, userId: string, productId: string): Promise<Rating> => {
    if (isEmpty(star) || isEmpty(userId) || isEmpty(productId)) {
      throw new HttpException(400, 'Please enter a valid values');
    }
    if (star < 0 || star > 5) throw new HttpException(400, 'Please enter a valid values');
    const isUserExist = await this.userModel.findById({ _id: userId });
    if (!isUserExist) throw new HttpException(400, 'Please enter a valid values');

    const isProductExist = await this.productModel.findById({ _id: productId });
    if (!isProductExist) throw new HttpException(400, 'Please enter a valid values');

    const rating = await this.ratingModel.create({ star, userId, productId });
    return rating;
  };
}

export default RatingService;
