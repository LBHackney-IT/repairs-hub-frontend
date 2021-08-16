import { render } from '@testing-library/react'
import SelectOperatives from './SelectOperatives'

describe('SelectOperatives component', () => {
  const operatives = [
    {
      id: 1,
      name: 'Operative A',
    },
    {
      id: 2,
      name: 'Operative B',
    },
    {
      id: 3,
      name: 'Operative C',
    },
  ]

  const props = {
    updateTotalPercentage: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <SelectOperatives
        assignedOperativesToWorkOrder={[operatives[0]]}
        availableOperatives={operatives}
        register={() => {}}
        updateTotalPercentage={props.updateTotalPercentage}
        selectedPercentagesToShowOnEdit={[]}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
