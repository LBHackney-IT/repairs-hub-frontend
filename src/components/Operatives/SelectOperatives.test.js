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

  it('should render properly', () => {
    const { asFragment } = render(
      <SelectOperatives
        assignedOperativesToWorkOrder={[operatives[0]]}
        availableOperatives={operatives}
        register={() => {}}
        selectedPercentagesToShowOnEdit={[]}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
