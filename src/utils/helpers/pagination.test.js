import { paginationSummary } from './pagination'

it('lists the current page item count in relation to the total', () => {
  expect(paginationSummary({ total: 10, pageSize: 2, currentPage: 3 })).toEqual(
    'Showing 5—6 of 10 results'
  )

  expect(paginationSummary({ total: 20, pageSize: 5, currentPage: 3 })).toEqual(
    'Showing 11—15 of 20 results'
  )

  expect(paginationSummary({ total: 14, pageSize: 5, currentPage: 3 })).toEqual(
    'Showing 11—14 of 14 results'
  )

  expect(
    paginationSummary({ total: 20, pageSize: 20, currentPage: 1 })
  ).toEqual('Showing 1—20 of 20 results')

  expect(
    paginationSummary({ total: 10, pageSize: 20, currentPage: 1 })
  ).toEqual('Showing 1—10 of 10 results')

  expect(paginationSummary({ total: 10, pageSize: 1, currentPage: 1 })).toEqual(
    'Showing 1—1 of 10 results'
  )

  expect(paginationSummary({ total: 0, pageSize: 10, currentPage: 1 })).toEqual(
    'Showing 0 of 0 results'
  )
})
