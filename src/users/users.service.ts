import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as argon from 'argon2';
import { ShortenLinkInterface } from '../shorten-link/interfaces/shortenLink.interface';
import {
  ShortenLinkDocument,
  ShortenLink,
} from '../shorten-link/entities/shorten-link.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(ShortenLink.name)
    private shortenLinkService: Model<ShortenLinkDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      const shortenLinkResults: ShortenLinkInterface[] =
        await this.shortenLinkService.find().exec();
      // console.log(shortenLinkResults);
      const userResults = await this.userModel.find().exec();
      // console.log(userResults);

      if (userResults && shortenLinkResults) {
        for (const userResult of userResults) {
          const shortenLinks = shortenLinkResults?.filter(
            (shortenLink) => shortenLink.userId === userResult._id.toString(),
          );
          userResult.createdLink = shortenLinks;
        }
      }

      return userResults;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findById(id: string): Promise<User | string> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createUser(user: CreateUserDto): Promise<User | string> {
    try {
      const checkUser = await this.userModel.findOne({
        username: user.username,
      });
      // console.log(checkUser);
      if (checkUser) {
        throw new Error('User already exists');
      }

      const hash = await argon.hash(user.password);
      const newUser = await this.userModel.create({
        ...user,
        password: hash,
      });
      // const newUser = await this.userModel.create(user);

      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User | string> {
    try {
      const checkUser = await this.findById(id);
      if (!checkUser) {
        throw new Error('User not found');
      }
      const userResult = await this.userModel.findOneAndUpdate(
        { id },
        { ...user },
        { new: true },
      );
      return userResult;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      const userResult = await this.userModel.findOneAndDelete({ id });
      return userResult;
    } catch (error) {
      throw new Error(error);
    }
  }
}
