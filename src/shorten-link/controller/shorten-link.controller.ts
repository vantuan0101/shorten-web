import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateShortenLinkDto } from '../dto/create-shorten-link.dto';
import { PageOptionsDto } from '../dto/PageOptionsDto';
import { UpdateShortenLinkDto } from '../dto/update-shorten-link.dto';
import { ShortenLinkService } from '../service/shorten-link.service';

@Controller('shorten-link')
export class ShortenLinkController {
  constructor(private readonly shortenLinkService: ShortenLinkService) {}

  @Post()
  createShortenLink(
    @Body() createShortenLinkDto: CreateShortenLinkDto,
    @Req() request: Request,
  ) {
    return this.shortenLinkService.create(createShortenLinkDto, request);
  }

  @Get()
  findAllShortenLink(@Query() pageOptionsDto: PageOptionsDto) {
    return this.shortenLinkService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOneShortenLinkById(@Param('id') id: string) {
    return this.shortenLinkService.findOne(id);
  }

  @Patch(':id')
  updateShortenLinkById(
    @Param('id') id: string,
    @Body() updateShortenLinkDto: UpdateShortenLinkDto,
  ) {
    return this.shortenLinkService.update(id, updateShortenLinkDto);
  }

  @Delete(':id')
  removeShortenLinkById(@Param('id') id: string) {
    return this.shortenLinkService.remove(id);
  }
}
