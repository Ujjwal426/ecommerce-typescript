import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import { loginUserDto } from '../dtos/login.dto';

class AuthController {
  public authService = new AuthService();

  public loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqBody: loginUserDto = req.body;
      const { token, user } = await this.authService.loginUser(reqBody);
      res.status(200).json({
        data: user,
        token,
        message: `Login user successfully`,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
