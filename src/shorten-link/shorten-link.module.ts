import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UserRepositories } from '../users/repositorites/user.repositorities';
import { ShortenLinkRepositories } from './repositorites/shortenLink.repositorites';
import { User, UserSchema } from '../users/entites/user.entites';
import { ShortenLink, ShortenLinkSchema } from './entities/shorten-link.entity';
import { ShortenLinkService } from './service/shorten-link.service';
import { ShortenLinkController } from './controller/shorten-link.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortenLink.name, schema: ShortenLinkSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ShortenLinkController],
  providers: [ShortenLinkService, ShortenLinkRepositories, UserRepositories],
})
export class ShortenLinkModule {}
