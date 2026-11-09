import { getServerSideProps } from '@/pages/access-denied'
import { checkAuthorisation, redirectToLogin } from '@/utils/auth/authSession'

jest.mock('@/utils/auth/authSession', () => ({
  checkAuthorisation: jest.fn(),
  redirectToLogin: jest.fn(),
}))

const mockCheckAuthorisation = jest.mocked(checkAuthorisation)

describe('access denied getServerSideProps', () => {
  const ctx = { req: {}, res: {} }

  it('sends a user who is not signed in to /login', async () => {
    mockCheckAuthorisation.mockResolvedValue({ status: 'unauthenticated' })

    const result = await getServerSideProps(ctx)

    expect(redirectToLogin).toHaveBeenCalledWith(ctx.res)
    expect(result).toEqual({ props: {} })
  })

  it('shows the page to a signed in user with no recognised group', async () => {
    mockCheckAuthorisation.mockResolvedValue({ status: 'forbidden' })

    const result = await getServerSideProps(ctx)

    expect(redirectToLogin).not.toHaveBeenCalled()
    expect(result).toEqual({ props: {} })
  })

  it('shows the page to a signed in user whose role does not fit the page', async () => {
    mockCheckAuthorisation.mockResolvedValue({
      status: 'authorised',
      user: {} as never,
    })

    const result = await getServerSideProps(ctx)

    expect(redirectToLogin).not.toHaveBeenCalled()
    expect(result).toEqual({ props: {} })
  })

  it('does not ask for a redirect, which would send the page to itself', async () => {
    mockCheckAuthorisation.mockResolvedValue({ status: 'forbidden' })

    await getServerSideProps(ctx)

    expect(mockCheckAuthorisation).toHaveBeenCalledWith(ctx)
  })
})
