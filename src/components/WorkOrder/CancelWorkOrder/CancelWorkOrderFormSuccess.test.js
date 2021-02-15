import { render } from '@testing-library/react'
import CancelWorkOrderFormSuccess from './CancelWorkOrderFormSuccess'

describe('CancelWorkOrderFormSuccess component', () => {
  const props = {
    workOrderReference: '10000000',
    propertyReference: '00012345',
    shortAddress: '16 Pitcairn House  St Thomass Square',
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <CancelWorkOrderFormSuccess
        workOrderReference={props.workOrderReference}
        propertyReference={props.propertyReference}
        shortAddress={props.shortAddress}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
