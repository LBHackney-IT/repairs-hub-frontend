import { useRef } from 'react'
import useClickOutside from './useClickOutside'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockHandler = jest.fn()

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

describe('useClickOutside', async () => {
  it('does nothing when the click is inside the element', () => {
    render(<MockComponent />)
    await act(() => userEvent.click(screen.getByText('Inside text')))
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('fires the handler when there is a click outside the element', async () => {
    render(<MockComponent />)
    await act(() => userEvent.click(screen.getByText('Outside text')))
    expect(mockHandler).toHaveBeenCalledTimes(1)
  })
})
