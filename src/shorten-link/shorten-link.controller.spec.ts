import { Test, TestingModule } from '@nestjs/testing';
import { ShortenLinkController } from './shorten-link.controller';
import { ShortenLinkService } from './shorten-link.service';

describe('ShortenLinkController', () => {
  let controller: ShortenLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenLinkController],
      providers: [ShortenLinkService],
    }).compile();

    controller = module.get<ShortenLinkController>(ShortenLinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
