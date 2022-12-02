import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { handlePageOptions } from './common/handlePageOptions';
import { PageOptionsDto } from './shorten-link/dto/PageOptionsDto';
import { User, UserDocument } from './users/entites/user.entites';
import {
  ShortenLink,
  ShortenLinkDocument,
} from './shorten-link/entities/shorten-link.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(ShortenLink.name)
    private shortenLinkService: Model<ShortenLinkDocument>,
    @InjectModel(User.name) private userService: Model<UserDocument>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async redirectLink(shortedUrl: string, response: Response, request: Request) {
    const urlShortLink = `${process.env.BASE_URL}link/${shortedUrl}`;
    const shortenLinkResults = await this.shortenLinkService.findOneAndUpdate(
      {
        shortLink: urlShortLink,
      },
      { $inc: { countClick: 1 } },
    );
    if (!shortenLinkResults) {
      throw new HttpException('Link Not Found', HttpStatus.BAD_REQUEST);
    }

    const { user } = request.cookies;
    // console.log('user', user);
    if (user) {
      await this.userService.findOneAndUpdate(
        { _id: user._id },
        { $push: { clickedLink: shortenLinkResults._id } },
      );
    }
    return response.redirect(shortenLinkResults?.linkToRedirect);
  }

  async getAllLinkOfUsers(pageOptionsDto: PageOptionsDto) {
    const { limit, skip, sortOptions } = handlePageOptions(pageOptionsDto);
    const users = await this.userService
      .find({})
      .select({ password: 0 })
      .populate({
        path: 'createdLink',
        options: { limit, skip, sort: sortOptions },
      })
      .populate({
        path: 'clickedLink',
        options: { limit, skip, sort: sortOptions },
      });

    return users;
  }

  async getAllLinkOfUserById(id: string, pageOptionsDto: PageOptionsDto) {
    const { limit, skip, sortOptions } = handlePageOptions(pageOptionsDto);

    const user = await this.userService
      .findOne({ _id: id })
      .select({ password: 0 })
      .populate({
        path: 'createdLink',
        options: { limit, skip, sort: sortOptions },
      })
      .populate({
        path: 'clickedLink',
        options: { limit, skip, sort: sortOptions },
      });

    return user;
  }

  async checkDisableUser(request: Request) {
    const { user } = request.cookies;
    if (!user) {
      throw new HttpException('You are not yet login', HttpStatus.BAD_REQUEST);
    }
    const ipAddress =
      request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    const checkIp = await this.redis.hget(
      `user:${user._id}:ip`,
      `${ipAddress}`,
    );
    if (!checkIp) {
      throw new HttpException(
        'User has been disabled , please login again',
        HttpStatus.BAD_REQUEST,
      );
    }
    return checkIp;
  }
}
