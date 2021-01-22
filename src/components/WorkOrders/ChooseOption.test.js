import { render } from '@testing-library/react'
import ChooseOption from './ChooseOption'

describe('ChooseOption component', () => {
  const props = {
    reference: '00012345',
  }

  it('should render properly', () => {
    const { asFragment } = render(<ChooseOption reference={props.reference} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
