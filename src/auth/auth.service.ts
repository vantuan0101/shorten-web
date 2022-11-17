/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { UserInterface } from '../users/interfaces/user.interface';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async login(
    loginAuthDto: LoginAuthDto,
    request: Request,
    response: Response,
  ) {
    try {
      // console.log(loginAuthDto);
      const user: UserInterface = await this.userModel.findOne({
        username: loginAuthDto.username,
      });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await argon.verify(
        user.password,
        loginAuthDto.password,
      );
      delete user.password;
      if (!isPasswordValid) {
        throw new Error('Password is not valid');
      }
      response.cookie('user', user);
      return { errCode: 0, user };
    } catch (error) {
      throw error;
    }
  }

  async logout(response: Response) {
    try {
      response.clearCookie('user');
      return { errCode: 0, message: 'Logout success' };
    } catch (error) {
      throw error;
    }
  }

  async signup(signUpAuthDto: SignUpAuthDto) {
    try {
      // console.log(signUpAuthDto);

      const user: UserInterface = await this.userModel.findOne({
        username: signUpAuthDto.username,
      });
      if (user) {
        throw new Error('User already exists');
      }

      const hash = await argon.hash(signUpAuthDto.password);
      const newUser = await this.userModel.create({
        ...signUpAuthDto,
        password: hash,
      });
      return { errCode: 0, user: newUser };
    } catch (error) {
      throw error;
    }
  }
}
