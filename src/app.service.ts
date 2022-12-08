import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Response, Request } from "express";
import { Model } from "mongoose";
import { InjectRedis, Redis } from "@nestjs-modules/ioredis";
import { handlePageOptions } from "./common/handlePageOptions";
import { PageOptionsDto } from "./shorten-link/dto/PageOptionsDto";
import { User, UserDocument } from "./users/entites/user.entites";
import {
  ShortenLink,
  ShortenLinkDocument,
} from "./shorten-link/entities/shorten-link.entity";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(ShortenLink.name)
    private shortenLinkService: Model<ShortenLinkDocument>,
    @InjectModel(User.name) private userService: Model<UserDocument>,
    @InjectRedis() private readonly redis: Redis
  ) {}

  async redirectLink(shortedUrl: string, response: Response, request: Request) {
    const urlShortLink = `${process.env.BASE_URL}link/${shortedUrl}`;
    const shortenLinkResults = await this.shortenLinkService.findOneAndUpdate(
      {
        shortLink: urlShortLink,
      },
      { $inc: { countClick: 1 } }
    );
    if (!shortenLinkResults) {
      throw new HttpException("Link Not Found", HttpStatus.BAD_REQUEST);
    }

    const { user } = request.cookies;
    // console.log('user', user);
    if (user) {
      await this.userService.findOneAndUpdate(
        { _id: user._id },
        { $push: { clickedLink: shortenLinkResults._id } }
      );
    }
    return response.redirect(shortenLinkResults?.linkToRedirect);
  }

  async checkDisableUser(request: Request, ipAddress: string) {
    const { user } = request.cookies;
    if (!user) {
      return {
        disable: false,
        status: HttpStatus.UNAUTHORIZED,
        message: "You are not yet login",
      };
      // throw new HttpException('You are not yet login', HttpStatus.BAD_REQUEST);
    }
    const checkIp = await this.redis.hget(
      `user:${user._id}:ip`,
      `${ipAddress}`
    );
    if (!checkIp) {
      return {
        disable: true,
        status: HttpStatus.UNAUTHORIZED,
        message: "User has been disabled , please login again",
      };
    }
    return checkIp;
  }
}
