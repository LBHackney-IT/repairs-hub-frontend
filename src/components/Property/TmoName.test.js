import { render } from '@testing-library/react'
import TmoName from './TmoName'

describe('TmoName component', () => {
  const props = {
    tmoName: 'Test address TMO',
  }

  it('should render properly', async () => {
    const { asFragment } = render(<TmoName tmoName={props.tmoName} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
