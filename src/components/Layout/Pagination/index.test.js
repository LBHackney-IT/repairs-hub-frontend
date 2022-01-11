import Pagination from '.'

import { render, screen } from '@testing-library/react'

describe('Pagination', () => {
  const otherProps = { url: { pathname: '/items' } }

  describe('item counts', () => {
    it('lists the count in relation to the number of items on the page', () => {
      render(
        <Pagination total={15} pageSize={5} currentPage={2} {...otherProps} />
      )

      screen.getByText('Showing 6—10 of 15 results')
    })
  })

  describe('previous page link', () => {
    it('does not display a previous page link when the current page is 1', () => {
      render(
        <Pagination total={10} pageSize={1} currentPage={1} {...otherProps} />
      )

      expect(
        screen.queryByRole('link', { name: 'Previous page' })
      ).not.toBeInTheDocument()
    })

    it('displays a previous page link when the current page is above 1', () => {
      render(
        <Pagination total={10} pageSize={1} currentPage={2} {...otherProps} />
      )

      screen.getByRole('link', { name: 'Previous page' })
    })
  })

  describe('next page link', () => {
    it('does not display a next page link when the current page is the last one', () => {
      render(
        <Pagination total={2} pageSize={1} currentPage={2} {...otherProps} />
      )

      expect(
        screen.queryByRole('link', { name: 'Next page' })
      ).not.toBeInTheDocument()
    })

    it('displays a next page link when the current page is not the last one', () => {
      render(
        <Pagination total={2} pageSize={1} currentPage={1} {...otherProps} />
      )

      screen.getByRole('link', { name: 'Next page' })
    })
  })

  describe('numbered page links', () => {
    let total
    let pageSize
    let lastPage

    describe('when there are more than five pages total', () => {
      beforeEach(() => {
        total = 20
        pageSize = 2
        lastPage = 10
      })

      it('displays the next five pages as links when the current page is the first one', () => {
        render(
          <Pagination
            total={total}
            pageSize={pageSize}
            currentPage={1}
            {...otherProps}
          />
        )

        screen.getByRole('link', { name: 'Page 1, current page' })
        screen.getByRole('link', { name: 'Page 2' })
        screen.getByRole('link', { name: 'Page 3' })
        screen.getByRole('link', { name: 'Page 4' })
        screen.getByRole('link', { name: 'Page 5' })
      })

      it('displays the previous five pages as links when the current page is the last one', () => {
        render(
          <Pagination
            total={total}
            pageSize={pageSize}
            currentPage={lastPage}
            {...otherProps}
          />
        )

        screen.getByRole('link', { name: 'Page 6' })
        screen.getByRole('link', { name: 'Page 7' })
        screen.getByRole('link', { name: 'Page 8' })
        screen.getByRole('link', { name: 'Page 9' })
        screen.getByRole('link', { name: 'Page 10, current page' })
      })

      it('displays the surrounding five pages as links when the current page is in the middle', () => {
        render(
          <Pagination
            total={total}
            pageSize={pageSize}
            currentPage={2}
            {...otherProps}
          />
        )

        screen.getByRole('link', { name: 'Page 1' })
        screen.getByRole('link', { name: 'Page 2, current page' })
        screen.getByRole('link', { name: 'Page 3' })
        screen.getByRole('link', { name: 'Page 4' })
        screen.getByRole('link', { name: 'Page 5' })
      })

      it('displays the surrounding five pages as links when the current page is in the middle', () => {
        render(
          <Pagination
            total={total}
            pageSize={pageSize}
            currentPage={5}
            {...otherProps}
          />
        )

        screen.getByRole('link', { name: 'Page 3' })
        screen.getByRole('link', { name: 'Page 4' })
        screen.getByRole('link', { name: 'Page 5, current page' })
        screen.getByRole('link', { name: 'Page 6' })
        screen.getByRole('link', { name: 'Page 7' })
      })

      it('displays the surrounding five pages as links when the current page is in the middle', () => {
        render(
          <Pagination
            total={total}
            pageSize={pageSize}
            currentPage={7}
            {...otherProps}
          />
        )

        screen.getByRole('link', { name: 'Page 5' })
        screen.getByRole('link', { name: 'Page 6' })
        screen.getByRole('link', { name: 'Page 7, current page' })
        screen.getByRole('link', { name: 'Page 8' })
        screen.getByRole('link', { name: 'Page 9' })
      })
    })

    describe('when there are fewer pages than the maximum displayable page links', () => {
      beforeEach(() => {
        total = 5
        pageSize = 2
        lastPage = 3
      })

      it('displays all next pages as links when the current page is the first one', () => {
        render(
          <Pagination
            total={total}
            pageSize={pageSize}
            currentPage={1}
            {...otherProps}
          />
        )

        screen.getByRole('link', { name: 'Page 1, current page' })
        screen.getByRole('link', { name: 'Page 2' })
        screen.getByRole('link', { name: 'Page 3' })
      })

      it('displays all previous pages as links when the current page is the last one', () => {
        render(
          <Pagination
            total={total}
            pageSize={pageSize}
            currentPage={lastPage}
            {...otherProps}
          />
        )

        screen.getByRole('link', { name: 'Page 1' })
        screen.getByRole('link', { name: 'Page 2' })
        screen.getByRole('link', { name: 'Page 3, current page' })
      })

      it('displays all surrounding pages as links when the current page is in the middle', () => {
        render(
          <Pagination
            total={total}
            pageSize={pageSize}
            currentPage={2}
            {...otherProps}
          />
        )

        screen.getByRole('link', { name: 'Page 1' })
        screen.getByRole('link', { name: 'Page 2, current page' })
        screen.getByRole('link', { name: 'Page 3' })
      })
    })
  })

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <Pagination
        total={1}
        pageSize={1}
        currentPage={1}
        className={'some-class'}
        {...otherProps}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
