import { render } from '@testing-library/react'
import WorkOrderUpdateSuccess from './Success'

describe('WorkOrderUpdateSuccess component', () => {
  const props = {
    workOrderReference: '10000012',
  }

  describe('should render properly', () => {
    it('requires authorisation', () => {
      const { asFragment } = render(
        <WorkOrderUpdateSuccess
          workOrderReference={props.workOrderReference}
          requiresAuthorisation={true}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    it('does not require authorisation', () => {
      const { asFragment } = render(
        <WorkOrderUpdateSuccess
          workOrderReference={props.workOrderReference}
          requiresAuthorisation={false}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
