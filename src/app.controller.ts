import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppService } from './app.service';

@Controller('link')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/users')
  getAllLinkOfUsers() {
    return this.appService.getAllLinkOfUsers();
  }

  @Get('/user/:id')
  getAllLinkOfUserById(@Param('id') id: string) {
    return this.appService.getAllLinkOfUserById(id);
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
