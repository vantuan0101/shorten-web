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
  if (sortShortLink || sortLinkToRedirect || sortCountClick) {
    Object.assign(
      sortOptions,
      { sortLink: sortShortLink },
      { linkToRedirect: sortLinkToRedirect },
      { countClick: sortCountClick },
    );
  } else {
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
