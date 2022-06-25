import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { CreateUserDto } from '../dtos/user.dto';
import { Routes } from '../interfaces/routes.interface';
import validationError from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';

class UserRoute implements Routes {
  public path = '/';
  public router = Router();
  public userController = new UserController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}create`, validationError(CreateUserDto, 'body'), this.userController.createUser);
    this.router.get(`${this.path}allusers`, authMiddleware, this.userController.getUsers);
    this.router.get(`${this.path}:id`, this.userController.getUser);
    this.router.post(`${this.path}update`, authMiddleware, validationError(CreateUserDto, 'body', true), this.userController.updateUser);
    this.router.delete(`${this.path}delete`, authMiddleware, this.userController.deleteUser);
  }
}

export default UserRoute;
