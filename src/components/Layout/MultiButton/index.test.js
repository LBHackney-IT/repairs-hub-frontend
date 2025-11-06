import MultiButton from '.'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

beforeAll(() => {
  global.Storage.prototype.setItem = jest.fn()

  global.Storage.prototype.getItem = jest
    .fn()
    .mockReturnValueOnce(undefined)
    .mockReturnValueOnce(undefined)
    .mockReturnValueOnce(JSON.stringify('1'))
})

const MockComponent = () => (
  <MultiButton
    name="example-key"
    label="Select something"
    choices={[
      {
        href: '#',
        title: 'Foo',
        description: 'Example description 1',
      },
      {
        href: '#',
        title: 'Bar',
        description: 'Example description 2',
      },
    ]}
    workOrderReference="10000040"
  />
)

describe('MultiButton', () => {
  it("shows an initial value if there's nothing stored", () => {
    render(<MockComponent />)

    expect(screen.getAllByText('Foo').length).toBe(2)
    expect(screen.getAllByRole('radio').length).toBe(2)
  })

  it('allows a user to choose between options', () => {
    render(<MockComponent />)

    act(() => {
      fireEvent.click(screen.getByText('Bar'))
    })

    expect(screen.getAllByText('Bar').length).toBe(2)
  })

  it('remembers a non-default value', () => {
    render(<MockComponent />)

    expect(screen.getAllByText('Bar').length).toBe(2)
  })

  it('closes the details panel after an option is clicked', async () => {
    render(<MockComponent />)

    expect(screen.getByTestId('details').getAttribute('open')).toBe(null)

    await act(async () => {
      await userEvent.click(screen.getByText('Select action'))
    })

    expect(screen.getByTestId('details').getAttribute('open')).toBe('')

    await act(async () => {
      await userEvent.click(screen.getByText('Bar'))
    })

    expect(screen.getByTestId('details').getAttribute('open')).toBe(null)
  })

  it('closes the details panel after the enter key is pressed', () => {
    render(<MockComponent />)

    act(() => {
      userEvent.click(screen.getByText('Select action'))
      fireEvent.keyUp(screen.getByText('Bar'), { key: 'Enter', code: 'Enter' })
    })

    expect(screen.getByTestId('details').getAttribute('open')).toBe(null)
  })
})
