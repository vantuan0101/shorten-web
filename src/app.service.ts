import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import { User, UserDocument } from './users/schemas/user.schema';
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
  ) {}

  async shortLink(shortedUrl: string, response: Response, request: Request) {
    try {
      const urlShortLink = `${process.env.BASE_URL}link/${shortedUrl}`;
      const shortenLinkResults = await this.shortenLinkService.findOne({
        shortLink: urlShortLink,
      });
      // console.log(shortenLinkResults);
      if (!shortenLinkResults) {
        throw new Error('Link not found');
      }
      const shortenResults = await this.shortenLinkService.findOneAndUpdate(
        {
          shortLink: urlShortLink,
        },
        { countClick: shortenLinkResults.countClick + 1 },
      );
      const { user } = request.cookies;
      // console.log('user', user);
      if (user) {
        const userResults = await this.userService.findOne({
          _id: user._id,
        });
        // console.log('userResults', userResults);

        const checkExist = userResults.clickedLink.findIndex(
          (item) => item.shortLinkId === shortenLinkResults.shortLink,
        );
        // console.log(checkExist);
        if (checkExist === -1) {
          const userUpdate = await this.userService.findOneAndUpdate(
            {
              _id: user._id,
            },
            {
              clickedLink: [
                ...userResults.clickedLink,
                {
                  shortLinkId: shortenResults.shortLink,
                  countClick: 1,
                },
              ],
            },
          );
        } else {
          const clickedList = userResults.clickedLink;
          clickedList[checkExist].countClick += 1;
          const userUpdate = await this.userService.updateOne(
            {
              _id: user._id,
            },
            {
              clickedLink: clickedList,
            },
          );
        }
      }
      response.redirect(shortenLinkResults?.linkToRedirect);

      return shortenResults;
    } catch (error) {
      throw new Error(error);
    }
  }
}
