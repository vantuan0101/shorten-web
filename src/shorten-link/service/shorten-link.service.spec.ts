import { Test, TestingModule } from '@nestjs/testing';
import { ShortenLinkService } from './shorten-link.service';

describe('ShortenLinkService', () => {
  let service: ShortenLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortenLinkService],
    }).compile();

    service = module.get<ShortenLinkService>(ShortenLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
