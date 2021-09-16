import NumberInput from '.'
import { fireEvent, render } from '@testing-library/react'

describe('NumberInput', () => {
  it('renders a number input', () => {
    const inputName = 'my-number-input'
    const inputLabel = 'My Input'
    const { getByLabelText } = render(
      <NumberInput name={inputName} label={inputLabel} />
    )

    const labelRegex = new RegExp(`s*${inputLabel}s*`)
    const input = getByLabelText(labelRegex)

    expect(input).toBeInTheDocument()
    expect(input.id).toEqual(inputName)
    expect(input.name).toEqual(inputName)
  })

  it('performs an action onChange', () => {
    let newValue = ''
    const myAction = jest.fn((e) => (newValue = e.target.value))
    const { getByLabelText } = render(
      <NumberInput name={'my-input'} label={'My Input'} onChange={myAction} />
    )

    fireEvent.change(getByLabelText(/\s*My Input\s*/), {
      target: { value: '2423242526' },
    })

    expect(newValue).toEqual('2423242526')
  })
})
