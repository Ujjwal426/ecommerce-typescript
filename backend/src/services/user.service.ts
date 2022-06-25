import { compare, hash } from 'bcryptjs';
import { CreateUserDto } from '../dtos/user.dto';
import { HttpException } from '../exceptions/HttpException';
import { User } from '../interfaces/user.interface';
import UserModel from '../models/user.model';
import { isEmpty } from 'class-validator';

class UserService {
  public userModel = UserModel;

  /**
   * create the user
   * @param userData CreateUserDto
   * @returns User
   */
  public createUser = async (userData: CreateUserDto): Promise<User> => {
    if (isEmpty(userData)) {
      throw new HttpException(400, `Please Provide all values`);
    }
    const findUser = await this.userModel.findOne({ email: userData.email });
    const isPhoneExist = await this.userModel.findOne({ phone: userData.phone });
    if (isPhoneExist) {
      throw new HttpException(409, `Your phone ${userData.phone} already exists`);
    }
    if (findUser) {
      throw new HttpException(409, `Your email ${userData.email} already exists`);
    }

    const hashedPassword = await hash(userData.password, 10);
    const createUserData = await this.userModel.create({ ...userData, password: hashedPassword });

    return createUserData;
  };

  /**
   * get the all users
   * @returns All Users
   */
  public getUsers = async (): Promise<User[]> => {
    const users = await this.userModel.find();
    return users;
  };

  /**
   * get the user by id
   * @param _id string
   * @returns User
   */
  public getUser = async (_id: string): Promise<User> => {
    if (isEmpty(_id)) {
      throw new HttpException(400, 'User does not exist.....');
    }
    const findUser = await this.userModel.findById({ _id });
    if (!findUser) {
      throw new HttpException(400, 'User does not exist.....');
    }
    return findUser;
  };

  /**
   *  Updates the user
   * @param userData CreateUserDto
   * @param authUser User
   * @returns Updated user
   */
  public updateUser = async (data: CreateUserDto, authUser: User): Promise<User> => {
    if (isEmpty(data)) throw new HttpException(400, `Bad Request`);

    const user = await this.userModel.findOne({ _id: authUser._id });

    // Exisiting email check
    if (data.email) {
      const isEmailExist = await this.userModel.findOne({ email: data.email });
      if (isEmailExist) {
        throw new HttpException(400, `Email already exist`);
      }
    }

    // Generating password hash
    let hashedPassword;
    if (data.password) {
      const isMatch = await compare(data.password, user.password);
      if (isMatch) {
        throw new HttpException(400, `Please enter a new password`);
      }
      hashedPassword = await hash(data.password, 10);
    }

    // Duplicate phone check
    if (data.phone) {
      const isPhoneExist = await this.userModel.findOne({ phone: data.phone });
      if (isPhoneExist) {
        throw new HttpException(400, `Phone no already exist`);
      }
    }

    // Updating user
    const updatedUser = await this.userModel.findByIdAndUpdate(
      authUser._id,
      {
        name: data.name || user.name,
        email: data.email || user.email,
        password: hashedPassword || user.password,
        phone: data.phone || user.phone,
      },
      { new: true },
    );
    return updatedUser;
  };

  /**
   * delete User
   * @param authUser User
   * @returns User
   */
  public deleteUser = async (authUser: User): Promise<User> => {
    const user = await this.userModel.findByIdAndRemove({ _id: authUser._id });
    if (!user) {
      throw new HttpException(400, 'User does not exist');
    }
    return user;
  };
}

export default UserService;
