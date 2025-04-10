import { useRef } from 'react'
import useClickOutside from './useClickOutside'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockHandler = jest.fn()
jest.mock('next/router', () => ({ useRouter: jest.fn() }))

const MockComponent = () => {
  const ref = useRef(null)

  useClickOutside(ref, mockHandler)

  return (
    <>
      <a className="lbh-link" href="#">
        Outside text
      </a>
      <div ref={ref}>Inside text</div>
    </>
  )
}

describe('useClickOutside', () => {
  beforeEach(() => {
    mockHandler.mockReset()
  })

  it('does nothing when the click is inside the element', async () => {
    const user = userEvent.setup()

    render(<MockComponent />)
    await user.click(screen.getByText('Inside text'))

    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('fires the handler when there is a click outside the element', async () => {
    const user = userEvent.setup()

    render(<MockComponent />)
    await user.click(screen.getByText('Outside text'))

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })
})
