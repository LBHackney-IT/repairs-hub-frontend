import type { ComponentProps } from 'react'
import { render } from '@testing-library/react'
import MyApp from '@/pages/_app'
import { navigateToPage } from '@/utils/navigation'

// jsdom can't load `jose`, and nothing here needs the real authSession
jest.mock('@/utils/auth/authSession', () => ({
  AUTH_WHITELIST: [],
  checkAuthorisation: jest.fn(),
  redirectToAcessDenied: jest.fn(),
}))
jest.mock('@/utils/navigation')

describe('MyApp when the user is not signed in', () => {
  const props = ({
    Component: () => <p>The page</p>,
    pageProps: {},
    router: {},
    unauthenticated: true,
  } as unknown) as ComponentProps<typeof MyApp>

  it('renders nothing', () => {
    const { container } = render(<MyApp {...props} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('sends the browser to /login with a full page load', () => {
    render(<MyApp {...props} />)

    expect(navigateToPage).toHaveBeenCalledTimes(1)
    expect(navigateToPage).toHaveBeenCalledWith('/login')
  })
})
