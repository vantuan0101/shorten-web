import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ShortenLink } from './entities/shorten-link.entity';
import { ShortenLinkService } from './shorten-link.service';
import { CreateShortenLinkDto } from './dto/create-shorten-link.dto';
import { UpdateShortenLinkDto } from './dto/update-shorten-link.dto';

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
  findAllShortenLink(): Promise<ShortenLink[]> {
    return this.shortenLinkService.findAll();
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
