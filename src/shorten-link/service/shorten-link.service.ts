import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import ShortUniqueId from 'short-unique-id';
import { UserRepositories } from '../../users/repositorites/user.repositorities';
import { CreateShortenLinkDto } from '../dto/create-shorten-link.dto';
import { PageOptionsDto } from '../dto/PageOptionsDto';
import { UpdateShortenLinkDto } from '../dto/update-shorten-link.dto';
import { ShortenLinkRepositories } from '../repositorites/shortenLink.repositorites';

@Injectable()
export class ShortenLinkService {
  constructor(
    private readonly shortenLinkRepositories: ShortenLinkRepositories,
    private readonly userRepositories: UserRepositories,
  ) {}

  async create(createShortenLinkDto: CreateShortenLinkDto, request: Request) {
    let randomLink = null;
    if (createShortenLinkDto.alias) {
      const { alias } = createShortenLinkDto;
      const checkAlias = await this.shortenLinkRepositories.findOneByOptions({
        shortLink: `${process.env.BASE_URL}link/${alias}`,
      });
      if (checkAlias) {
        throw new HttpException('Alias already exists', HttpStatus.BAD_REQUEST);
      }
      randomLink = createShortenLinkDto.alias;
    } else {
      const uid = new ShortUniqueId({ length: 5 });
      randomLink = uid();
    }
    const shortLink = `${process.env.BASE_URL}link/${randomLink}`;
    const shortenLinkResults = await this.shortenLinkRepositories.create({
      ...createShortenLinkDto,
      shortLink,
    });
    const { user } = request.cookies;
    if (user) {
      await this.userRepositories.updateById(user._id, {
        $push: { createdLink: shortenLinkResults._id },
      });
    }
    return shortenLinkResults;
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const shortenLinkResults = await this.shortenLinkRepositories.findAll(
      {},
      pageOptionsDto,
    );
    return shortenLinkResults;
  }

  async findOne(id: string) {
    const shortenLinkResults = await this.shortenLinkRepositories.findById(id);
    return shortenLinkResults;
  }

  async update(id: string, updateShortenLinkDto: UpdateShortenLinkDto) {
    const shortenLinkResults = await this.shortenLinkRepositories.updateById(
      id,
      { ...updateShortenLinkDto },
    );
    return shortenLinkResults;
  }

  async remove(id: string) {
    const shortenLinkResults = await this.shortenLinkRepositories.deleteById(
      id,
    );
    return shortenLinkResults;
  }
}
