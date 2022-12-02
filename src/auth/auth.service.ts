/* eslint-disable no-useless-catch */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { Response, Request } from 'express';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { getInfoDevice } from '../common/getInfoDevice';
import { User, UserDocument } from '../users/entites/user.entites';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async login(loginAuthDto: LoginAuthDto, req: Request, response: Response) {
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
    await this.redis.set(`user:${user._id}:info`, JSON.stringify(user));
    const checkDevice = getInfoDevice(req.get('User-Agent'));
    const ipAddress = req.headers['x-forwarded-for'] || req.ip;
    // console.log(ipAddress);
    await this.redis.hset(
      `user:${user._id}:ip`,
      `${ipAddress}`,
      JSON.stringify(checkDevice),
    );
    return user;
  }

  async logout(id: string, response: Response) {
    try {
      // console.log(req.cookies('user'));
      response.clearCookie('user');
      await this.redis.del(`user:${id}`);
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

  async socialLogin(req: Request, response: Response) {
    if (!req.user) {
      return 'No user';
    }
    const infoUser: any = req.user;
    const checkUser = await this.userModel.findOne({
      email: infoUser.email,
    });
    let newUser = null;
    if (!checkUser) {
      newUser = await this.userModel.create({
        email: infoUser.email,
        firstName: infoUser.firstName,
        lastName: infoUser.lastName,
        picture: infoUser.picture,
      });
    }

    response.cookie('user', newUser || checkUser);
    const idReturn = checkUser ? checkUser._id : newUser._id;
    await this.redis.set(
      `user:${idReturn}:info`,
      JSON.stringify(newUser || checkUser),
    );
    return response.redirect(`${process.env.CLIENT_URL}/login?id=${idReturn}`);
  }
}
