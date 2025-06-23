import { render, waitFor } from '@testing-library/react'
import MobileWorkingCloseWorkOrderForm from './MobileWorkingCloseWorkOrderForm'

describe('MobileWorkingCloseWorkOrderForm component', () => {
  it('should render properly', async () => {
    const { asFragment } = render(
      <MobileWorkingCloseWorkOrderForm
        onSubmit={jest.fn()}
        isLoading={false}
        defaultValues={{}}
      />
    )

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
