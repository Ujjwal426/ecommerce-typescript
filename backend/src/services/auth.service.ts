import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import 'dotenv/config';
import { HttpException } from '../exceptions/HttpException';
import { DataStoredToken, TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface';
import userModel from '../models/user.model';
import { isEmpty } from '../utils/empty';
import { loginUserDto } from '../dtos/login.dto';

class AuthService {
  public users = userModel;
  /**
   * login user
   * @param data loginUserDto
   * @returns Token and User
   */
  public loginUser = async (data: loginUserDto): Promise<{ token: TokenData; user: User }> => {
    if (isEmpty(data)) {
      throw new HttpException(400, 'Please Provide a all values...');
    }
    const user = await this.users.findOne({ email: data.email });

    if (!user) {
      throw new HttpException(409, 'User not exist.....');
    }
    const matchPassword = await compare(data.password, user.password);
    if (!matchPassword) {
      throw new HttpException(409, 'Invalid Credentials.....');
    }
    const token = this.createToken(user);
    return { token, user };
  };

  public createToken = (user: User): TokenData => {
    const dataStoredInToken: DataStoredToken = { _id: user._id };
    const secretKey: string = process.env.SECRET_KEY;
    const expiresIn: number = 60 * 60;
    return { expiresIn, token: sign(dataStoredInToken, secretKey) };
  };
}

export default AuthService;
