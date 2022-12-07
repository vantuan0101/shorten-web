import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entites/user.entites';
import { AuthController } from './controller/auth.controller';
import { AuthRepositories } from './repositorities/auth.repositorities';
import { AuthService } from './service/auth.service';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, FacebookStrategy, GoogleStrategy, AuthRepositories],
})
export class AuthModule {}
