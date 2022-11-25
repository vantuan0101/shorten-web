import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { User, UserSchema } from '../users/entites/user.entites';
import { ShortenLink, ShortenLinkSchema } from './entities/shorten-link.entity';
import { ShortenLinkService } from './shorten-link.service';
import { ShortenLinkController } from './shorten-link.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortenLink.name, schema: ShortenLinkSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ShortenLinkController],
  providers: [ShortenLinkService],
})
export class ShortenLinkModule {}
