import { render } from '@testing-library/react'
import Meta from '.'

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>
    },
  }
})

describe('Meta component', () => {
  describe('when supplied without a title', () => {
    it('renders the application title', () => {
      render(<Meta />, {
        container: document.head,
      })
      expect(document.title).toEqual('Hackney Repairs Hub')
    })
  })

  describe('when supplied with a title', () => {
    it('renders the custom title with the application title appended', () => {
      render(<Meta title="Search" />, {
        container: document.head,
      })
      expect(document.title).toEqual('Search | Hackney Repairs Hub')
    })
  })
})
