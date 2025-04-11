import { render, fireEvent } from '@testing-library/react'
import MobileMenuButton from '.'

describe('MobileMenuButton', () => {
  it('runs the supplied function when clicked', () => {
    const mockFunction = jest.fn()

    const { getByTestId } = render(
      <MobileMenuButton
        onClick={mockFunction}
        mobileMenuOpen={false}
      />
    )

    fireEvent(
      getByTestId('mobile-menu-button'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )
    expect(mockFunction).toHaveBeenCalled()
  })

  it('renders the open menu icon when mobileMenuOpen is false', () => {
    const { getByTestId } = render(
      <MobileMenuButton
        onClick={jest.fn()}
        mobileMenuOpen={false}
      />
    )

    expect(getByTestId('menu-open')).toBeInTheDocument()
  })

  it('renders the close menu icon when mobileMenuOpen is true', () => {
    const { getByTestId } = render(
      <MobileMenuButton
        onClick={jest.fn()}
        mobileMenuOpen={true}
      />
    )

    expect(getByTestId('menu-close')).toBeInTheDocument()
  })
})
