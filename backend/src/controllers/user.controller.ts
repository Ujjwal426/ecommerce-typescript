import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import { RequestWithUser } from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface';
import { CreateUserDto } from '../dtos/user.dto';
import { HttpException } from '../exceptions/HttpException';

export class UserController {
  public userService = new UserService();
  public authService = new AuthService();

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqBody: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(reqBody);
      const token = this.authService.createToken(createUserData);
      if (!token) throw new HttpException(400, 'Please provide token');
      res.status(201).json({ data: createUserData, token, message: `User Created....` });
    } catch (err) {
      next(err);
    }
  };
  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsers: User[] = await this.userService.getUsers();
      res.status(200).json({ data: findAllUsers, message: 'List of all users' });
    } catch (error) {
      next(error);
    }
  };

  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const user: User = await this.userService.getUser(userId);

      res.status(200).json({ data: user, message: 'Users details' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const authUser = req.user;
      const reqBody: CreateUserDto = req.body;
      const updatedUser: User = await this.userService.updateUser(reqBody, authUser);
      res.status(200).json({ data: updatedUser, message: `User updated successfully` });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const authUser = req.user;
      const deletedUser: User = await this.userService.deleteUser(authUser);
      res.status(200).json({ data: deletedUser, message: `Deleted user successfully` });
    } catch (error) {
      next(error);
    }
  };
}
