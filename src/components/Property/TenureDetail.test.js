import { render } from '@testing-library/react'
import TenureDetail from './TenureDetail'

describe('TenureDetail component with TMO name', () => {
  const props = {
    detail: 'Test address TMO',
    text: 'TMO',
  }

  it('should render properly', async () => {
    const { asFragment } = render(
      <TenureDetail
        text={props.text}
        detail={props.detail}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
