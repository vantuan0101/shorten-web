import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationUserGuard implements CanActivate {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const { user } = request.cookies;
    if (!user) throw new HttpException('Please login', HttpStatus.UNAUTHORIZED);
    const checkUser = await this.redis.get(`user:${user._id}:info`);
    const { role, _id } = JSON.parse(checkUser);
    if (role !== 'admin' && user._id !== _id) {
      throw new HttpException('You are not authorize', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
