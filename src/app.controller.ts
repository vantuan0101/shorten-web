import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { PageOptionsDto } from './shorten-link/dto/PageOptionsDto';
import { AppService } from './app.service';

@Controller('link')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/users')
  getAllLinkOfUsers(@Query() pageOptionsDto: PageOptionsDto) {
    return this.appService.getAllLinkOfUsers(pageOptionsDto);
  }

  @Get('/user/:id')
  getAllLinkOfUserById(
    @Param('id') id: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.appService.getAllLinkOfUserById(id, pageOptionsDto);
  }

  @Get('/:shortedUrl')
  shortenUrl(
    @Param('shortedUrl') shortedUrl: string,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    return this.appService.redirectLink(shortedUrl, response, request);
  }
}
