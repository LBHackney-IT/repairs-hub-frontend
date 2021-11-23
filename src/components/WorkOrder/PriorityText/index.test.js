import { render } from '@testing-library/react'
import PriorityText from '.'
import { WorkOrder } from '../../../models/workOrder'

describe('PriorityText component', () => {
  let workOrder = new WorkOrder({ priority: '1 [P] PRIORITY' })

  it('renders the text with any supplied additional classes', () => {
    const { asFragment } = render(
      <PriorityText workOrder={workOrder} className="stayClassy" />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  describe('when the work order is higher priority', () => {
    beforeEach(() => {
      workOrder.isHigherPriority = () => true
    })

    it('renders the text with a highlight class', () => {
      const { asFragment } = render(<PriorityText workOrder={workOrder} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when the work order is not higher priority', () => {
    beforeEach(() => {
      workOrder.isHigherPriority = () => false
    })

    it('renders the text without a highlight class', () => {
      const { asFragment } = render(<PriorityText workOrder={workOrder} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
