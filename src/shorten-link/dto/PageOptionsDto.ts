import { IsOptional } from 'class-validator';

export class PageOptionsDto {
  @IsOptional()
  readonly page: number;

  @IsOptional()
  readonly limit: number;

  @IsOptional()
  readonly sortShortLink: number;

  @IsOptional()
  readonly sortLinkToRedirect: number;

  @IsOptional()
  readonly sortCountClick: number;
}
