/* eslint-disable no-useless-catch */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { Response } from 'express';
import { User, UserDocument } from '../users/entites/user.entites';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async login(loginAuthDto: LoginAuthDto, response: Response) {
    // console.log(loginAuthDto);
    const user = await this.userModel
      .findOne({
        username: loginAuthDto.username,
      })
      .lean();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const isPasswordValid = await argon.verify(
      user.password,
      loginAuthDto.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'User Name or Password is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
    delete user.password;
    delete user.clickedLink;
    delete user.createdLink;
    response.cookie('user', user);
    return user;
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

      const user = await this.userModel.findOne({
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
      const userRes = newUser.toObject();
      delete userRes.password;
      return { errCode: 0, userRes };
    } catch (error) {
      throw error;
    }
  }
}
