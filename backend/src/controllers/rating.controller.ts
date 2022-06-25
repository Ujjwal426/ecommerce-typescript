import { Rating } from '../interfaces/rating.interface';
import { Request, Response, NextFunction } from 'express';
import RatingService from '../services/rating.service';

export class RatingController {
  public ratingService = new RatingService();
  public createRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { star, userId, productId } = req.body;
      const rating: Rating = await this.ratingService.createRating(star, userId, productId);
      res.status(200).json({ data: rating, meesage: 'Created Rating' });
    } catch (error) {
      next(error);
    }
  };
}
