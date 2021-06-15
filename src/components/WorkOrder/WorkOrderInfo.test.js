import { render } from '@testing-library/react'
import {
  IMMEDIATE_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
} from '../../utils/helpers/priorities'
import WorkOrderInfo from './WorkOrderInfo'

describe('WorkOrderInfo component', () => {
  let workOrder = {
    reference: 10000012,
    dateRaised: '2021-01-18T15:28:57.17811',
    lastUpdated: null,
    priority: 'some priority text',
    property: '16 Pitcairn House  St Thomass Square',
    owner: 'Alphatrack (S) Systems Lt',
    description: 'This is an urgent repair description',
    propertyReference: '00012345',
    status: 'In Progress',
    priorityCode: URGENT_PRIORITY_CODE,
    raisedBy: 'Dummy Agent',
    target: '2021-01-23T18:30:00.00000',
    tradeCode: 'DE',
    tradeDescription: 'DOOR ENTRY ENGINEER - DE',
    callerName: 'Jill Smith',
    callerNumber: '07700 900999',
    contractorReference: 'SCC',
  }

  it('should render properly', () => {
    const { asFragment } = render(<WorkOrderInfo workOrder={workOrder} />)
    expect(asFragment()).toMatchSnapshot()
  })

  describe('when the work order is immediate priority', () => {
    beforeEach(() => {
      workOrder = { ...workOrder, priorityCode: IMMEDIATE_PRIORITY_CODE }
    })

    it('includes an highlight for that priority', () => {
      const { asFragment } = render(<WorkOrderInfo workOrder={workOrder} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
