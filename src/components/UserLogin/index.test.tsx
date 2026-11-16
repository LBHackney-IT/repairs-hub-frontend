import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'
import UserLogin from '.'

jest.mock('next-auth/react', () => ({ signIn: jest.fn() }))

describe('UserLogin', () => {
  it('renders the sign in heading and the Google sign in button', () => {
    render(<UserLogin />)

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Sign in with Google' })
    ).toBeInTheDocument()
  })

  it('does not start signing in until the button is clicked', () => {
    render(<UserLogin />)

    expect(signIn).not.toHaveBeenCalled()
  })

  it('signs in with Cognito, returning to the home page, when the button is clicked', async () => {
    render(<UserLogin />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Sign in with Google' })
    )

    expect(signIn).toHaveBeenCalledTimes(1)
    expect(signIn).toHaveBeenCalledWith('cognito', { callbackUrl: '/' })
  })
})
