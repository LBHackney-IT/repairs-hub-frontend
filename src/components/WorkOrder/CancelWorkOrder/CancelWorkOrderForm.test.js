import { render } from '@testing-library/react'
import CancelWorkOrderForm from './CancelWorkOrderForm'

describe('CancelWorkOrderForm component', () => {
  const props = {
    workOrder: {
      reference: 10000012,
      description: 'Broken pipe in bathroom',
      property: '315 Banister House Homerton High Street',
      propertyReference: '00012345',
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
})
