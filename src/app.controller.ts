import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppService } from './app.service';

@Controller('link')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:shortedUrl')
  shortenUrl(
    @Param('shortedUrl') shortedUrl: string,
    @Res() response: Response,
    @Req() request: Request,
  ): any {
    return this.appService.shortLink(shortedUrl, response, request);
  }
}
