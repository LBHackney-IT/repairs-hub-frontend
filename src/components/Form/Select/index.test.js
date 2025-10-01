import { render, fireEvent } from '@testing-library/react'
import Select from '.'

describe('Select component', () => {
  const props = {
    label: 'Foo select',
    name: 'fooSelect',
    options: ['foo', 'bar'],
    error: {},
  }

  it('should render properly', () => {
    const { getByRole, getByTestId } = render(<Select {...props} />)

    expect(getByTestId('fooSelect')).toBeInTheDocument()
    expect(getByRole('option', { name: 'bar' })).toBeInTheDocument()
    expect(getByRole('option', { name: 'foo' })).toBeInTheDocument()
  })

  it('should handle selected option', () => {
    const { getByRole, getByTestId } = render(<Select {...props} />)

    fireEvent.change(getByTestId('fooSelect'), { target: { value: 'foo' } })
    expect(getByRole('option', { name: 'foo' }).selected).toBeTruthy()
    expect(getByRole('option', { name: 'bar' }).selected).toBeFalsy()
  })
})
