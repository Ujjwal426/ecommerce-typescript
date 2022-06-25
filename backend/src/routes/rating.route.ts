import { Router } from 'express';
import validationError from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import { RatingDto } from '../dtos/rating.dto';
import { Routes } from '../interfaces/routes.interface';
import { RatingController } from '../controllers/rating.controller';

class RatingRoute implements Routes {
  public path = '/rating';
  public router = Router();
  public ratingController = new RatingController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, authMiddleware, validationError(RatingDto, 'body', true, false), this.ratingController.createRating);
  }
}

export default RatingRoute;
