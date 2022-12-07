import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { Request, Response } from 'express';
import { getInfoDevice } from '../../common/getInfoDevice';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { SignUpAuthDto } from '../dto/signup-auth.dto';
import { AuthRepositories } from '../repositorities/auth.repositorities';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepositories: AuthRepositories,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async login(
    loginAuthDto: LoginAuthDto,
    req: Request,
    response: Response,
    ipAddress: string,
  ) {
    // console.log(loginAuthDto);

    const user = await this.authRepositories.findOneByOptions(
      {
        username: loginAuthDto.username,
      },
      { clickedLink: 0, createdLink: 0 },
    );
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
    // console.log(user);
    console.time();
    const setPromiseUserInfo = this.redis.set(
      `user:${user._id}:info`,
      JSON.stringify(user),
    );
    const setPromiseUserIp = this.redis.hset(
      `user:${user._id}:ip`,
      `${ipAddress}`,
      JSON.stringify(checkDevice),
    );
    await Promise.all([setPromiseUserInfo, setPromiseUserIp]);
    console.timeEnd();
    delete user.role;
    return user;
  }

  async logout(id: string, response: Response): Promise<string> {
    const user = await this.authRepositories.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    response.clearCookie('user');
    await this.redis.del(`user:${id}`);
    return 'Logout success';
  }

  async signup(signUpAuthDto: SignUpAuthDto): Promise<string> {
    // console.log(signUpAuthDto);

    const user = await this.authRepositories.findOneByOptions({
      username: signUpAuthDto.username,
    });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await argon.hash(signUpAuthDto.password);
    await this.authRepositories.create({
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
    const checkUser = await this.authRepositories.findOneByOptions({
      email: infoUser.email,
    });
    let newUser = null;
    if (!checkUser) {
      newUser = await this.authRepositories.create({
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
