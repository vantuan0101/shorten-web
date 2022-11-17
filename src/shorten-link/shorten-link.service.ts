import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ShortUniqueId from 'short-unique-id';
import { Request } from 'express';
import {
  ShortenLink,
  ShortenLinkDocument,
} from './entities/shorten-link.entity';
import { CreateShortenLinkDto } from './dto/create-shorten-link.dto';
import { UpdateShortenLinkDto } from './dto/update-shorten-link.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ShortenLinkService {
  constructor(
    @InjectModel(ShortenLink.name)
    private shortenLinkService: Model<ShortenLinkDocument>,
    @InjectModel(User.name) private userService: Model<UserDocument>,
  ) {}

  async create(createShortenLinkDto: CreateShortenLinkDto, request: Request) {
    // console.log(createShortenLinkDto);
    try {
      const randomLink = new ShortUniqueId({ length: 5 });
      // console.log(shortLink());
      const { user } = request.cookies;
      // console.log(user);
      const shortLink = `${process.env.BASE_URL}link/${randomLink()}`;
      const shortenLinkResults = await this.shortenLinkService.create({
        ...createShortenLinkDto,
        shortLink,
      });
      if (user) {
        await this.userService.findOneAndUpdate(
          { _id: user._id },
          { $push: { createdLink: shortLink } },
        );
      }
      return shortenLinkResults;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    const shortenLinkResults = await this.shortenLinkService.find({}).exec();
    return shortenLinkResults;
  }

  async findOne(id: string) {
    const shortenLinkResults = await this.shortenLinkService.findOne({ id });
    return shortenLinkResults;
  }

  async update(id: string, updateShortenLinkDto: UpdateShortenLinkDto) {
    const shortenLinkResults = await this.shortenLinkService.findOneAndUpdate(
      {
        id,
      },
      { ...updateShortenLinkDto },
      { new: true },
    );
    return shortenLinkResults;
  }

  async remove(id: string) {
    const shortenLinkResults = await this.shortenLinkService.findOneAndDelete({
      id,
    });
    return shortenLinkResults;
  }
}
