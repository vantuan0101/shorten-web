import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShortenLinkDto {
  @IsString()
  @IsNotEmpty()
  readonly linkToRedirect: string;

  @IsNumber()
  @IsOptional()
  readonly countClick: number = 0;

  @IsString()
  @IsOptional()
  readonly alias: string;
}
