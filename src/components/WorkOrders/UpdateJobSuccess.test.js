import { render } from '@testing-library/react'
import UpdateJobSuccess from './UpdateJobSuccess'

describe('UpdateJobSuccess component', () => {
  const props = {
    workOrderReference: '10000012',
  }

  describe('should render properly', () => {
    it('requires authorisation', () => {
      const { asFragment } = render(
        <UpdateJobSuccess
          workOrderReference={props.workOrderReference}
          requiresAuthorisation={true}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    it('does not require authorisation', () => {
      const { asFragment } = render(
        <UpdateJobSuccess
          workOrderReference={props.workOrderReference}
          requiresAuthorisation={false}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
