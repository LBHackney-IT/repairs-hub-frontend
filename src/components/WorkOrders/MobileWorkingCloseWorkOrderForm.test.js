import { render } from '@testing-library/react'
import MobileWorkingCloseWorkOrderForm from './MobileWorkingCloseWorkOrderForm'

describe('MobileWorkingCloseWorkOrderForm component', () => {
  it('should render properly', () => {
    const { asFragment } = render(
      <MobileWorkingCloseWorkOrderForm onSubmit={jest.fn()} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
