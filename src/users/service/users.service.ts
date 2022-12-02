import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as argon from 'argon2';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  ShortenLinkDocument,
  ShortenLink,
} from '../../shorten-link/entities/shorten-link.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from '../entites/user.entites';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(ShortenLink.name)
    private shortenLinkService: Model<ShortenLinkDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findAll() {
    const userResults = await this.userModel
      .find()
      .select({ password: 0, clickedLink: 0, createdLink: 0, role: 0 })
      .lean();

    return userResults;
  }

  async findById(id: string) {
    const checkUserCache = await this.redis.get(`user:${id}:info`);
    if (checkUserCache) {
      return JSON.parse(checkUserCache);
    }
    const user = await this.userModel
      .findById(id)
      .select({ password: 0, clickedLink: 0, createdLink: 0, role: 0 })
      .lean();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    await this.redis.set(`user:${user._id}:info`, JSON.stringify(user));
    return user;
  }

  async createUser(user: CreateUserDto) {
    const checkUser = await this.userModel.findOne({
      username: user.username,
    });
    // console.log(checkUser);
    if (checkUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hash = await argon.hash(user.password);
    const newUser = await this.userModel.create({
      ...user,
      password: hash,
    });
    return newUser;
  }

  async updateUser(id: string, user: UpdateUserDto) {
    const findCheckUser = this.findById(id);
    const getCacheUser = this.redis.get(`user:${id}:info`);
    const [checkUser, cacheUser] = await Promise.all([
      findCheckUser,
      getCacheUser,
    ]);
    // console.log(checkUser, cacheUser);
    if (!checkUser || !cacheUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (
      checkUser.role !== 'admin' &&
      checkUser._id !== JSON.parse(cacheUser)._id
    ) {
      throw new HttpException(
        'You are not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userResult = await this.userModel
      .findOneAndUpdate({ id }, { ...user }, { new: true })
      .select({ password: 0, clickedLink: 0, createdLink: 0 });
    const userCache = await this.redis.get(`user:${id}:info`);
    if (userCache) {
      await this.redis.set(`user:${id}:info`, JSON.stringify(userResult));
    }
    return userResult;
  }

  async deleteUser(id: string) {
    const findCheckUser = this.findById(id);
    const getCacheUser = this.redis.get(`user:${id}:info`);
    const [checkUser, cacheUser] = await Promise.all([
      findCheckUser,
      getCacheUser,
    ]);
    // console.log(checkUser, cacheUser);
    if (!checkUser || !cacheUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (
      checkUser.role !== 'admin' &&
      checkUser._id !== JSON.parse(cacheUser)._id
    ) {
      throw new HttpException(
        'You are not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userResult = await this.userModel
      .findOneAndDelete({ id })
      .select({ password: 0 });
    return userResult;
  }

  async disableUser(id: string) {
    const findCheckUser = this.findById(id);
    const getCacheUser = this.redis.get(`user:${id}:info`);
    const [checkUser, cacheUser] = await Promise.all([
      findCheckUser,
      getCacheUser,
    ]);
    // console.log(checkUser, cacheUser);
    if (!checkUser || !cacheUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (checkUser.role !== 'admin') {
      throw new HttpException(
        'You are not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.redis.del(`user:${id}:ip`);
  }
}