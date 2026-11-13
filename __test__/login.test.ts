import { getServerSideProps } from '@/pages/login'
import { checkAuthorisation, redirectToHome } from '@/utils/auth/authSession'

jest.mock('@/utils/auth/authSession', () => ({
  checkAuthorisation: jest.fn(),
  redirectToHome: jest.fn(),
}))

const mockCheckAuthorisation = jest.mocked(checkAuthorisation)

describe('login getServerSideProps', () => {
  const ctx = { req: {}, res: {} }

  it('redirects home when the user is already signed in', async () => {
    mockCheckAuthorisation.mockResolvedValue({
      status: 'authorised',
      user: {} as never,
    })

    const result = await getServerSideProps(ctx)

    expect(redirectToHome).toHaveBeenCalledWith(ctx.res)
    expect(result).toEqual({ props: {} })
  })

  it('shows the page when the user is not signed in', async () => {
    mockCheckAuthorisation.mockResolvedValue({ status: 'unauthenticated' })

    const result = await getServerSideProps(ctx)

    expect(redirectToHome).not.toHaveBeenCalled()
    expect(result).toEqual({ props: {} })
  })

  it('shows the page when the user is signed in but has no recognised group', async () => {
    mockCheckAuthorisation.mockResolvedValue({ status: 'forbidden' })

    const result = await getServerSideProps(ctx)

    expect(redirectToHome).not.toHaveBeenCalled()
    expect(result).toEqual({ props: {} })
  })

  it('does not ask for a redirect, which would send the page to itself', async () => {
    mockCheckAuthorisation.mockResolvedValue({ status: 'unauthenticated' })

    await getServerSideProps(ctx)

    expect(mockCheckAuthorisation).toHaveBeenCalledWith(ctx)
  })
})
