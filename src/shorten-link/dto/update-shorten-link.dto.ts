import { IsString, IsOptional } from 'class-validator';

export class UpdateShortenLinkDto {
  @IsString()
  @IsOptional()
  readonly linkToRedirect: string;

  @IsString()
  @IsOptional()
  readonly shortLink: string;
}
