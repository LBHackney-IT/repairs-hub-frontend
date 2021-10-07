import { render } from '@testing-library/react'
import WorkOrderUpdateForm from './Form'

describe('WorkOrderUpdateForm component', () => {
  const props = {
    propertyReference: '000012345',
    originalTasks: [
      {
        code: 'DES5R006',
        quantity: 1,
        original: true,
        originalQuantity: 1,
      },
    ],
    latestTasks: [
      {
        code: 'DES5R006',
        quantity: 2,
        original: true,
        originalQuantity: 1,
      },
      {
        code: 'DES5R005',
        quantity: 1,
        original: false,
        originalQuantity: null,
      },
    ],
    addedTasks: [
      {
        code: 'DES5R004',
        quantity: 2,
      },
    ],
    onGetToSummary: jest.fn(),
    setVariationReason: jest.fn(),
    variationReason: 'More work is necessary',
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <WorkOrderUpdateForm
        propertyReference={props.propertyReference}
        originalTasks={props.originalTasks}
        latestTasks={props.latestTasks}
        addedTasks={props.addedTasks}
        onGetToSummary={props.onGetToSummary}
        setVariationReason={props.setVariationReason}
        variationReason={props.variationReason}
        sorCodes={[
          {
            code: 'DES5R003',
            shortDescription: 'Immediate call outs',
            priority: {
              priorityCode: 1,
              description: '1 [I] IMMEDIATE',
            },
            cost: 0,
          },
          {
            code: 'DES5R004',
            shortDescription: 'Emergency call out',
            priority: {
              priorityCode: 2,
              description: '2 [E] EMERGENCY',
            },
          },
        ]}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
