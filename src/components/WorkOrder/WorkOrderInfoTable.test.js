import { render } from '@testing-library/react'
import WorkOrderInfoTable from './WorkOrderInfoTable'

describe('WorkOrderInfoTable component', () => {
  const props = {
    workOrder: {
      reference: 10000012,
      tradeDescription: 'DOOR ENTRY ENGINEER - DE',
      description: 'Broken pipe in bathroom',
      property: '315 Banister House Homerton High Street',
    },
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <WorkOrderInfoTable workOrder={props.workOrder} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
