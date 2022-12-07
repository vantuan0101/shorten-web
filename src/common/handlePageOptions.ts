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
    Object.assign(sortOptions, { sortLink: sortShortLink });
  }
  if (sortLinkToRedirect) {
    Object.assign(sortOptions, { linkToRedirect: sortLinkToRedirect });
  }
  if (sortCountClick) {
    Object.assign(sortOptions, { countClick: sortCountClick });
  }

  if (Object.keys(sortOptions).length === 0) {
    Object.assign(sortOptions, { _id: 1 });
  }
  const options = {
    limit,
    page,
    skip,
    sortOptions,
  };
  return options;
};
