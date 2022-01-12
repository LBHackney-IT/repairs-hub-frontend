export const paginationSummary = ({
  total = 0,
  currentPage = 1,
  pageSize = 0,
}) => {
  if (total === 0) {
    return 'Showing 0 of 0 results'
  }

  const currentPageFirstItemIndex =
    currentPage === 1 ? 1 : pageSize * (currentPage - 1) + 1

  const currentPageLastItemIndex =
    pageSize > total ? total : currentPageFirstItemIndex + pageSize - 1

  return `Showing ${currentPageFirstItemIndex}—${Math.min(
    currentPageLastItemIndex,
    total
  )} of ${total} results`
}
