import { render, act } from '@testing-library/react'
import AddSORCodes from '.'

describe.skip('AddSORCodes component', () => {
  it('should render the component', async () => {
    let component

    await act(async () => {
      component = render(<AddSORCodes />)
    })

    const { asFragment } = component
    expect(asFragment()).toMatchSnapshot()
  })
})
