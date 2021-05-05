import { render } from '@testing-library/react'
import UpdateWorkOrderSuccess from './UpdateWorkOrderSuccess'

describe('UpdateWorkOrderSuccess component', () => {
  const props = {
    workOrderReference: '10000012',
  }

  describe('should render properly', () => {
    it('requires authorisation', () => {
      const { asFragment } = render(
        <UpdateWorkOrderSuccess
          workOrderReference={props.workOrderReference}
          requiresAuthorisation={true}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    it('does not require authorisation', () => {
      const { asFragment } = render(
        <UpdateWorkOrderSuccess
          workOrderReference={props.workOrderReference}
          requiresAuthorisation={false}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
