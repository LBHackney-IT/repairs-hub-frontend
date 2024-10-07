import { render } from '@testing-library/react'
import MobileWorkingCloseWorkOrderForm from './MobileWorkingCloseWorkOrderForm'

describe('MobileWorkingCloseWorkOrderForm component', () => {
  process.env.NEXT_PUBLIC_FOLLOW_ON_FUNCTIONALITY_ENABLED = 'false'

  it('should render properly', () => {
    const { asFragment } = render(
      <MobileWorkingCloseWorkOrderForm onSubmit={jest.fn()} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

describe('MobileWorkingCloseWorkOrderForm component - when follow-on functionality is enabled', () => {
  process.env.NEXT_PUBLIC_FOLLOW_ON_FUNCTIONALITY_ENABLED = 'true'

  it('should render properly', () => {
    const { asFragment } = render(
      <MobileWorkingCloseWorkOrderForm onSubmit={jest.fn()} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
