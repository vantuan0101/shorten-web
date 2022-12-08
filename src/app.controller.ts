import { Controller, Get, Ip, Param, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { PageOptionsDto } from './shorten-link/dto/PageOptionsDto';
import { AppService } from './app.service';

@Controller('link')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/check')
  checkDisableUser(@Req() request: Request, @Ip() ipAddress: string) {
    return this.appService.checkDisableUser(request, ipAddress);
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
