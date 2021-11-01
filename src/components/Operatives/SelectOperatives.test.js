import { render } from '@testing-library/react'
import SelectOperatives from './SelectOperatives'

describe('SelectOperatives component', () => {
  const operatives = [
    {
      id: 1,
      name: 'Operative A',
      payrollNumber: 'PN1',
    },
    {
      id: 2,
      name: 'Operative B',
      payrollNumber: 'PN2',
    },
    {
      id: 3,
      name: 'Operative C',
      payrollNumber: 'PN3',
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

  it('should disable the current operative when a current user payroll number is supplied', () => {
    const { asFragment } = render(
      <SelectOperatives
        assignedOperativesToWorkOrder={operatives}
        availableOperatives={operatives}
        register={() => {}}
        selectedPercentagesToShowOnEdit={[]}
        currentUserPayrollNumber="PN1"
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
