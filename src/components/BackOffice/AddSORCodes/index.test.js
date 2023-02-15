import { render } from '@testing-library/react'
import AddSORCodes from '.'

describe('AddSORCodes component', () => {
  it('should render the component', async () => {
    const { asFragment } = render(<AddSORCodes />)

    expect(asFragment()).toMatchSnapshot()
  })
})
