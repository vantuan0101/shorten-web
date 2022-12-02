import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { User, UserSchema } from '../users/entites/user.entites';
import { AuthController } from './controller/auth.controller';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, FacebookStrategy, GoogleStrategy],
})
export class AuthModule {}
