import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import {
  ShortenLink,
  ShortenLinkSchema,
} from '../shorten-link/entities/shorten-link.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entites/user.entites';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: ShortenLink.name, schema: ShortenLinkSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
