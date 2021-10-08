import { render } from '@testing-library/react'
import UpdateWorkOrderSummary from './UpdateWorkOrderSummary'

describe('UpdateWorkOrderSummary component', () => {
  const props = {
    reference: '10000012',
    originalTasks: [
      {
        code: 'DES5R006',
        quantity: 2,
        original: true,
        originalQuantity: 2,
        cost: '10.5',
      },
    ],
    latestTasks: [
      {
        code: 'DES5R006',
        quantity: 3,
        original: true,
        originalQuantity: 2,
        cost: '10.5',
      },
      {
        code: 'DES5R005',
        quantity: 1,
        original: false,
        originalQuantity: null,
        cost: '14.5',
      },
    ],
    addedTasks: [
      {
        code: 'DES5R004',
        quantity: 2,
        original: false,
        originalQuantity: null,
        cost: '22.5',
      },
    ],
    onFormSubmit: jest.fn(),
    changeStep: jest.fn(),
    calculateTotal: jest.fn(),
    variationReason: 'More work is necessary',
  }

  describe('should render properly', () => {
    it('within vary spend limit', () => {
      const { asFragment } = render(
        <UpdateWorkOrderSummary
          reference={props.reference}
          onFormSubmit={props.onFormSubmit}
          originalTasks={props.originalTasks}
          latestTasks={props.latestTasks}
          addedTasks={props.addedTasks}
          changeStep={props.changeStep}
          variationReason={props.variationReason}
          varySpendLimit={250}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })

    it('over vary spend limit', () => {
      const { asFragment } = render(
        <UpdateWorkOrderSummary
          reference={props.reference}
          onFormSubmit={props.onFormSubmit}
          originalTasks={props.originalTasks}
          latestTasks={props.latestTasks}
          addedTasks={props.addedTasks}
          changeStep={props.changeStep}
          variationReason={props.variationReason}
          varySpendLimit={20}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
