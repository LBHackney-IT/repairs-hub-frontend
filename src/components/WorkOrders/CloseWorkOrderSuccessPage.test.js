import { render } from '@testing-library/react'
import CloseWorkOrderSuccessPage from './CloseWorkOrderSuccessPage'

describe('CloseWorkOrderSuccessPage component', () => {
  const props = {
    workOrderReference: '10000012',
  }

  describe('should render properly', () => {
    it('shows the message with closing confirmation', () => {
      const { asFragment } = render(
        <CloseWorkOrderSuccessPage
          workOrderReference={props.workOrderReference}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
