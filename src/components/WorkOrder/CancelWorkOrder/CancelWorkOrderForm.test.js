import { render } from '@testing-library/react'
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
            workOrder={{ ...props.workOrder, priorityCode: 1 }}
            onFormSubmit={props.onFormSubmit}
          />
        )

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('when the work order is urgent priority', () => {
      it('includes related warning text', () => {
        const { asFragment } = render(
          <CancelWorkOrderForm
            workOrder={{ ...props.workOrder, priorityCode: 2 }}
            onFormSubmit={props.onFormSubmit}
          />
        )

        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})
