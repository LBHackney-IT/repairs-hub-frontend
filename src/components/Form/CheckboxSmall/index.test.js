import { render } from '@testing-library/react'
import CheckboxSmall from '.'

describe('CheckboxSmall', () => {
  it('renders a checkbox', () => {
    const checkboxName = 'my-checkbox'
    const checkboxLabel = 'My Checkbox'
    const { getByLabelText } = render(
      <CheckboxSmall
        name={checkboxName}
        label={checkboxLabel}
        register={jest.fn()}
      />
    )

    const checkbox = getByLabelText(checkboxLabel)

    expect(checkbox).toBeInTheDocument()
    expect(checkbox.id).toEqual(checkboxName)
    expect(checkbox.name).toEqual(checkboxName)
  })
})
