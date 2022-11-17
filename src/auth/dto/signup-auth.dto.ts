import { PartialType } from '@nestjs/mapped-types';
import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
} from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class SignUpAuthDto extends PartialType(LoginAuthDto) {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
