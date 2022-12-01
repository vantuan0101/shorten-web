import { PageOptionsDto } from '../shorten-link/dto/PageOptionsDto';

export const handlePageOptions = (pageOptionsDto: PageOptionsDto) => {
  const {
    page = 1,
    limit = 10,
    sortShortLink,
    sortLinkToRedirect,
    sortCountClick,
  } = pageOptionsDto;
  const skip = (page - 1) * limit;
  const sortOptions = {};
  if (sortShortLink) {
    Object.assign(sortOptions, { sortLink: Number(sortShortLink) });
  }
  if (sortLinkToRedirect) {
    Object.assign(sortOptions, { linkToRedirect: Number(sortLinkToRedirect) });
  }
  if (sortCountClick) {
    Object.assign(sortOptions, { countClick: Number(sortCountClick) });
  }
  const options = {
    limit,
    page,
    skip,
    sortOptions,
  };
  return options;
};
