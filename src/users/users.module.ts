import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ShortenLinkRepositories } from '../shorten-link/repositorites/shortenLink.repositorites';
import { UserRepositories } from './repositorites/user.repositorities';
import {
  ShortenLink,
  ShortenLinkSchema,
} from '../shorten-link/entities/shorten-link.entity';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { User, UserSchema } from './entites/user.entites';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: ShortenLink.name, schema: ShortenLinkSchema },
    ]),
  ],
  providers: [UsersService, ShortenLinkRepositories, UserRepositories],
  controllers: [UsersController],
})
export class UsersModule {}
