import { render } from '@testing-library/react'
import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
} from '@/utils/helpers/priorities'
import CancelWorkOrderForm from './CancelWorkOrderForm'

describe('CancelWorkOrderForm component', () => {
  let props = {
    workOrder: {
      reference: 10000012,
      description: 'Broken pipe in bathroom',
      property: '315 Banister House Homerton High Street',
      propertyReference: '00012345',
      contractorReference: 'HCK',
    },
    onFormSubmit: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <CancelWorkOrderForm
        workOrder={props.workOrder}
        onFormSubmit={props.onFormSubmit}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  describe('when the work order is for the DLO', () => {
    beforeEach(() => {
      props.workOrder.contractorReference = 'H01'
    })

    describe('when the work order is immediate priority', () => {
      it('includes related warning text', () => {
        const { asFragment } = render(
          <CancelWorkOrderForm
            workOrder={{
              ...props.workOrder,
              priorityCode: IMMEDIATE_PRIORITY_CODE,
            }}
            onFormSubmit={props.onFormSubmit}
          />
        )

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('when the work order is emergency priority', () => {
      it('includes related warning text', () => {
        const { asFragment } = render(
          <CancelWorkOrderForm
            workOrder={{
              ...props.workOrder,
              priorityCode: EMERGENCY_PRIORITY_CODE,
            }}
            onFormSubmit={props.onFormSubmit}
          />
        )

        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})
