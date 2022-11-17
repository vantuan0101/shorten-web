import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateShortenLinkDto {
  @IsString()
  @IsNotEmpty()
  readonly linkToRedirect: string;

  @IsNumber()
  @IsOptional()
  readonly countClick: number = 0;

  @IsString()
  @IsOptional()
  readonly userId: string;
}
