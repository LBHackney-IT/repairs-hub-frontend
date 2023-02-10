import SorCode from '@/root/src/models/sorCode'
import { render } from '@testing-library/react'
import NewSORCode from '.'

describe('NewSORCode component', () => {
  it('should render the component', async () => {
    const sorCode = new SorCode(1, 'ASD123YO', 25.50, 47, 'Short Description', 'Long Description')
    const { asFragment } = render(<NewSORCode 
      key={sorCode.id}
      sorCode={sorCode}
      handleRemoveSORCode={jest.fn()}
      handleSORCodeFieldChange={jest.fn()}/>)

    expect(asFragment()).toMatchSnapshot()
  })
})
