import { render } from '@testing-library/react'
import EditWorkOrder from './EditWorkOrder'

const mockWorkOrderReference = 10000040

describe('EditWorkOrder Component', () => {
  it('should render correctly', () => {
    const { asFragment } = render(
      <EditWorkOrder workOrderReference={mockWorkOrderReference} />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
