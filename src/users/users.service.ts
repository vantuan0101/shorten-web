import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as argon from 'argon2';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  ShortenLinkDocument,
  ShortenLink,
} from '../shorten-link/entities/shorten-link.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entites/user.entites';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(ShortenLink.name)
    private shortenLinkService: Model<ShortenLinkDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findAll(): Promise<User[]> {
    const userResults = await this.userModel.find().select({ password: 0 });

    return userResults;
  }

  async findById(id: string): Promise<User | any> {
    const checkUserCache = await this.redis.get(`user:${id}`);
    if (checkUserCache) {
      return JSON.parse(checkUserCache);
    }
    const user = await this.userModel
      .findById(id)
      .select({ password: 0, clickedLink: 0, createdLink: 0 })
      .exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    await this.redis.set(`user:${user._id}`, JSON.stringify(user));
    return user;
  }

  async createUser(user: CreateUserDto): Promise<User | any> {
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

  async updateUser(id: string, user: UpdateUserDto): Promise<User | any> {
    const checkUser = await this.findById(id);
    if (!checkUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const userResult = await this.userModel
      .findOneAndUpdate({ id }, { ...user }, { new: true })
      .select({ password: 0 });
    const userCache = await this.redis.get(`user:${id}`);
    if (userCache) {
      await this.redis.set(`user:${id}`, JSON.stringify(userResult));
    }
    return userResult;
  }

  async deleteUser(id: string): Promise<User> {
    const userResult = await this.userModel
      .findOneAndDelete({ id })
      .select({ password: 0 });
    return userResult;
  }
}
