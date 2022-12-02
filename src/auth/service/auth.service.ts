import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { Response, Request } from 'express';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { UserDocument, User } from '../../users/entites/user.entites';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { SignUpAuthDto } from '../dto/signup-auth.dto';
import { getInfoDevice } from '../../common/getInfoDevice';

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
      .select({ clickedLink: 0, createdLink: 0, role: 0 })
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
    response.cookie('user', user);
    const checkDevice = getInfoDevice(req.get('User-Agent'));
    const ipAddress = req.headers['x-forwarded-for'] || req.ip;
    // console.log(ipAddress);
    // console.time();
    const setCacheUserInfo = this.redis.set(
      `user:${user._id}:info`,
      JSON.stringify(user),
    );
    const setCacheUserDetectIp = this.redis.hset(
      `user:${user._id}:ip`,
      `${ipAddress}`,
      JSON.stringify(checkDevice),
    );
    Promise.all([setCacheUserInfo, setCacheUserDetectIp]);
    // console.timeEnd();
    return user;
  }

  async logout(id: string, response: Response): Promise<string> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    response.clearCookie('user');
    await this.redis.del(`user:${id}`);
    return 'Logout success';
  }

  async signup(signUpAuthDto: SignUpAuthDto): Promise<string> {
    // console.log(signUpAuthDto);

    const user = await this.userModel.findOne({
      username: signUpAuthDto.username,
    });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await argon.hash(signUpAuthDto.password);
    await this.userModel.create({
      ...signUpAuthDto,
      password: hashPassword,
    });
    return 'Sign up success';
  }

  async socialLogin(req: Request, response: Response): Promise<void> {
    if (!req.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    // console.log(req.user);
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
    const idUser = checkUser ? checkUser._id : newUser._id;
    await this.redis.set(
      `user:${idUser}:info`,
      JSON.stringify(newUser || checkUser),
    );
    response.redirect(`${process.env.CLIENT_URL}/login?id=${idUser}`);
  }
}
