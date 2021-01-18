import { render } from '@testing-library/react'
import RaiseRepairFormSuccess from './RaiseRepairFormSuccess'

describe('RaiseRepairFormSuccess component', () => {
  const props = {
    property: {
      propertyReference: '00012345',
      address: {
        shortAddress: '16 Pitcairn House  St Thomass Square',
      },
    },
    workOrderReference: 10000000,
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <RaiseRepairFormSuccess
        propertyReference={props.property.propertyReference}
        shortAddress={props.property.address.shortAddress}
        workOrderReference={props.workOrderReference}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
