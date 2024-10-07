import { render } from '@testing-library/react'
import MobileWorkingCloseWorkOrderForm from './MobileWorkingCloseWorkOrderForm'

describe('MobileWorkingCloseWorkOrderForm component', () => {
  it('should render properly', () => {
    const { asFragment } = render(
      <MobileWorkingCloseWorkOrderForm
        onSubmit={jest.fn()}
        followOnFunctionalityEnabled={false}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

describe('MobileWorkingCloseWorkOrderForm component - when follow-on functionality is enabled', () => {
  it('should render properly', () => {
    const { asFragment } = render(
      <MobileWorkingCloseWorkOrderForm
        onSubmit={jest.fn()}
        followOnFunctionalityEnabled={true}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
