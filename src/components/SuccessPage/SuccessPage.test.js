import { render } from '@testing-library/react'
import SuccessPage from './SuccessPage'

describe('SuccessPage component', () => {
  describe('when variation approved', () => {
    const props = {
      workOrder: {
        reference: '10000012',
      },
      text: 'You have approved a variation for',
    }
    it('should render properly with approved message', () => {
      const { asFragment } = render(
        <SuccessPage
          workOrderReference={props.workOrder.reference}
          text={props.text}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when variation approved', () => {
    const props = {
      workOrder: {
        reference: '10000012',
      },
      text: 'You have rejected a variation for',
    }
    it('should render properly with rejected message', () => {
      const { asFragment } = render(
        <SuccessPage
          workOrderReference={props.workOrder.reference}
          text={props.text}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
