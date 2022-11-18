export interface queryPaginationParams {
  limit: number;
  page: number;
}

interface queryPagination {
  limit: number;
  skip: number;
}

enum DEFAULT_PAGINATION {
  PAGE = 1,
  //MongoDB will return all documents in on first page if set to zero
  LIMIT = 0,
}

//Calculate skip and limit values for pagination
export function getPagination(query: queryPaginationParams): queryPagination {
  //Represent the amount of documents in one page
  const limit = Math.abs(query.limit) || DEFAULT_PAGINATION.LIMIT;
  const page = Math.abs(query.page) || DEFAULT_PAGINATION.PAGE;
  //The amount of documents that we want to skip if we're on a certain page.
  //If we're on page one we want to skip zero documents (that is the first page)
  //If we're on page 2, we want to skip the first limit documents
  //If we're on page 3, we want to skip the first limit times two documents
  const skip = (page - 1) * limit;
  return {
    limit,
    skip,
  };
}
