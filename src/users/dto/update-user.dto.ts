import { MaxLength, IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  readonly firstName: string;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  readonly username: string;

  @IsString()
  @IsOptional()
  readonly password: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;
}
