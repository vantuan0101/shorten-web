import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import * as argon from 'argon2';
import { handlePageOptions } from '../../common/handlePageOptions';
import { PageOptionsDto } from '../../shorten-link/dto/PageOptionsDto';
import { ShortenLinkRepositories } from '../../shorten-link/repositorites/shortenLink.repositorites';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepositories } from '../repositorites/user.repositorities';

@Injectable()
export class UsersService {
  constructor(
    private readonly shortenLinkRepositories: ShortenLinkRepositories,
    private readonly userRepositories: UserRepositories,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findAll() {
    const userResults = await this.userRepositories.findAll({
      password: 0,
      clickedLink: 0,
      createdLink: 0,
      role: 0,
    });
    return userResults;
  }

  async getAllLinkOfUsers(pageOptionsDto: PageOptionsDto) {
    const { limit, skip, sortOptions } = handlePageOptions(pageOptionsDto);

    const users = await this.userRepositories.findAllWithPopulate(
      [
        {
          path: 'createdLink',
          options: { limit, skip, sort: sortOptions },
        },
        {
          path: 'clickedLink',
          options: { limit, skip, sort: sortOptions },
        },
      ],
      { password: 0 },
    );

    return users;
  }

  async getAllLinkOfUserById(id: string) {
    const user = await this.userRepositories.findByIdWithPopulate(
      id,

      [
        {
          path: 'createdLink',
        },
        {
          path: 'clickedLink',
        },
      ],
      { password: 0 },
    );
    return user;
  }

  async findById(id: string) {
    const checkUserCache = await this.redis.get(`user:${id}:info`);
    if (checkUserCache) {
      return JSON.parse(checkUserCache);
    }
    const user = await this.userRepositories.findById(id, {
      password: 0,
      clickedLink: 0,
      createdLink: 0,
      role: 0,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    await this.redis.set(`user:${user._id}:info`, JSON.stringify(user));
    return user;
  }

  async createUser(user: CreateUserDto) {
    const checkUser = await this.userRepositories.findOneByOptions({
      username: user.username,
    });
    if (checkUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hash = await argon.hash(user.password);
    const newUser = await this.userRepositories.create({
      ...user,
      password: hash,
    });
    return newUser;
  }

  async updateUser(id: string, user: UpdateUserDto) {
    const checkUser = await this.findById(id);
    if (!checkUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const userResult = await this.userRepositories.updateById(
      id,
      { ...user },
      { password: 0, clickedLink: 0, createdLink: 0 },
    );
    const userCache = await this.redis.get(`user:${id}:info`);
    if (userCache) {
      await this.redis.set(`user:${id}:info`, JSON.stringify(userResult));
    }
    return userResult;
  }

  async deleteUser(id: string) {
    const checkUser = await this.findById(id);
    if (!checkUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const userResult = await this.userRepositories.deleteById(id);
    return userResult;
  }

  async disableUser(id: string) {
    const findCheckUser = await this.findById(id);
    const getCacheUser = this.redis.get(`user:${id}:info`);
    const [checkUser, cacheUser] = await Promise.all([
      findCheckUser,
      getCacheUser,
    ]);
    if (!findCheckUser || !cacheUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (checkUser.role !== 'admin') {
      throw new HttpException(
        'You are not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.redis.del(`user:${id}:ip`);
  }
}
