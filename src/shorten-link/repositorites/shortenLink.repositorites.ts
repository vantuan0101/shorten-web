import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ShortenLinkDocument,
  ShortenLink,
} from '../entities/shorten-link.entity';
import { BaseRepository } from '../../base.repository';

@Injectable()
export class ShortenLinkRepositories extends BaseRepository<
  ShortenLink,
  ShortenLinkDocument
> {
  constructor(
    @InjectModel(ShortenLink.name)
    private shortenLinkModel: Model<ShortenLinkDocument>,
  ) {
    super(shortenLinkModel);
  }
}
