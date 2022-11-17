import { MaxLength, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  readonly username: string;

  @IsString()
  @IsOptional()
  readonly password: string;
}
