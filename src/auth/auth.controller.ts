import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Post('signup')
  signup(@Body() signupDto: SignUpAuthDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginAuthDto, response);
  }

  @Post('logout')
  logout(@Body() id: string, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(id, response);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {}

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    return this.authService.socialLogin(req, response);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<any> {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    return this.authService.socialLogin(req, response);
  }

  // @Get('/get-user')
  // async getUser(@Req() req: Request) {
  //   return this.authService.getMe(req);
  // }
}
