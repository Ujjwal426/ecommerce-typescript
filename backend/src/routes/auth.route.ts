import { loginUserDto } from '../dtos/login.dto';
import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { Routes } from '../interfaces/routes.interface';
import validationError from '../middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}login`, validationError(loginUserDto, 'body'), this.authController.loginUser);
  }
}

export default AuthRoute;
