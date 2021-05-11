import { render } from '@testing-library/react'
import VariationAuthorisationSummary from './VariationAuthorisationSummary'

describe('VariationAuthorisationSummary component', () => {
  const props = {
    variationTasks: {
      notes: 'Variation reason: More work needed',
      tasks: [
        {
          code: 'DES5R005',
          currentQuantity: 1,
          description: 'Normal Call outs',
          id: 'abcd',
          originalQuantity: 1,
          unitCost: 4,
          variedQuantity: 4000,
        },
        {
          code: 'DES5R006',
          currentQuantity: 10,
          description: 'Normal Call outs',
          id: 'abc',
          originalQuantity: 1,
          unitCost: 19,
          variedQuantity: 2,
        },
      ],
      authorName: 'John Johnson (Alphatrack)',
      variationDate: '2021-05-11T16:04:05.008Z',
    },

    originalSors: [
      {
        id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
        code: 'DES5R006',
        description: 'Urgent call outs',
        dateAdded: '2021-02-03T09:33:35.757339',
        quantity: 2,
        cost: 10,
        status: 'Unknown',
        original: true,
        originalQuantity: 1,
      },
    ],
  }
  it('should render properly', () => {
    const { asFragment } = render(
      <VariationAuthorisationSummary
        variationTasks={props.variationTasks}
        originalSors={props.originalSors}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
