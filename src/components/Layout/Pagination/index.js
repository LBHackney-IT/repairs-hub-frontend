import PropTypes from 'prop-types'
import { paginationSummary } from '../../../utils/helpers/pagination'
import cx from 'classnames'
import Link from 'next/link'

const Pagination = ({ total, currentPage, pageSize, url, className }) => {
  const MAX_NUMBERED_PAGES = 5
  const MAX_SURROUNDING_PAGES = Math.floor(MAX_NUMBERED_PAGES / 2)

  const lastPage = Math.ceil(total / pageSize)
  const numberOfPagesInRange = Math.min(lastPage, MAX_NUMBERED_PAGES)
  const surroundingPagesIncludesLastPage =
    currentPage >= lastPage - MAX_SURROUNDING_PAGES

  const startingPageNumber = surroundingPagesIncludesLastPage
    ? Math.max(1, lastPage - MAX_NUMBERED_PAGES + 1)
    : Math.max(1, currentPage - MAX_SURROUNDING_PAGES)

  const numberedPages = [...Array(numberOfPagesInRange).keys()]
    .map((n) => n + startingPageNumber)
    .map((page) => ({
      isCurrent: page === currentPage,
      number: page,
      labelText: [
        `Page ${page}`,
        ...(page === currentPage ? ['current page'] : []),
      ].join(', '),
    }))

  return (
    <nav className={cx('lbh-pagination', className)}>
      <div className="lbh-pagination__summary">
        {paginationSummary({ total, currentPage, pageSize })}
      </div>
      <ul className="lbh-pagination">
        {currentPage > 1 && (
          <li className="lbh-pagination__item">
            <Link
              href={{
                ...url,
                query: { ...url.query, pageNumber: currentPage - 1 },
              }}
            >
              <a className="lbh-pagination__link" aria-label="Previous page">
                <span aria-hidden="true" role="presentation">
                  &laquo;
                </span>{' '}
                Previous
              </a>
            </Link>
          </li>
        )}

        {numberedPages.map((page) => {
          return (
            <li className="lbh-pagination__item" key={page.number}>
              <Link
                href={{
                  ...url,
                  query: { ...url.query, pageNumber: page.number },
                }}
              >
                <a
                  className={cx('lbh-pagination__link', {
                    'lbh-pagination__link--current': page.isCurrent,
                  })}
                  aria-label={page.labelText}
                  aria-current={page.isCurrent}
                >
                  {page.number}
                </a>
              </Link>
            </li>
          )
        })}

        {currentPage < lastPage && (
          <li className="lbh-pagination__item">
            <Link
              href={{
                ...url,
                query: { ...url.query, pageNumber: currentPage + 1 },
              }}
            >
              <a className="lbh-pagination__link" aria-label="Next page">
                Next{' '}
                <span aria-hidden="true" role="presentation">
                  &raquo;
                </span>
              </a>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  url: PropTypes.object.isRequired,
  className: PropTypes.string,
}

export default Pagination
