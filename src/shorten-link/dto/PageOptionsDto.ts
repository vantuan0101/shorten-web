import { IsOptional } from 'class-validator';

export class PageOptionsDto {
  @IsOptional()
  readonly page: number;

  @IsOptional()
  readonly limit: number;

  @IsOptional()
  readonly sortShortLink: any;

  @IsOptional()
  readonly sortLinkToRedirect: any;

  @IsOptional()
  readonly sortCountClick: any;
}
