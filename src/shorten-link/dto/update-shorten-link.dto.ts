import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateShortenLinkDto {
  @IsString()
  @IsOptional()
  readonly linkToRedirect: string;

  @IsString()
  @IsOptional()
  readonly shortLink: string;

  @IsNumber()
  @IsOptional()
  readonly countClick: number;

  @IsString()
  @IsOptional()
  readonly userId: string;
}
