import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@nestjs-modules/ioredis';
import { User, UserSchema } from './users/entites/user.entites';
import { UsersModule } from './users/users.module';
import { ShortenLinkModule } from './shorten-link/shorten-link.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import {
  ShortenLink,
  ShortenLinkSchema,
} from './shorten-link/entities/shorten-link.entity';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        url: 'redis-15662.c240.us-east-1-3.ec2.cloud.redislabs.com',
        port: 15662,
        password: 'kiBaZAdo6MU0Uvus0zSveStrwEGUjrd0',
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([
      { name: ShortenLink.name, schema: ShortenLinkSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    ShortenLinkModule,
    // ShortenLinkModel,
    AuthModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
