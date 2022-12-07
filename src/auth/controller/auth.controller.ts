import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { SignUpAuthDto } from '../dto/signup-auth.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Post('signup')
  signup(@Body() signupDto: SignUpAuthDto): Promise<string> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(
    @Body() loginAuthDto: LoginAuthDto,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @Ip() ipAddress: string,
  ) {
    return this.authService.login(loginAuthDto, req, response, ipAddress);
  }

  @Post('logout')
  @HttpCode(200)
  logout(
    @Body('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    return this.authService.logout(id, response);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.socialLogin(req, response);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return HttpStatus.OK;
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    return this.authService.socialLogin(req, response);
  }
}
