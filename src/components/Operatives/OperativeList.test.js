import { render } from '@testing-library/react'
import OperativeList from './OperativeList'

describe('OperativeList component', () => {
  const props = {
    operatives: [
      {
        id: 1,
        payrollNumber: 'test001',
        name: 'Test1',
        trades: [],
        jobPercentage: 50,
      },
      {
        id: 2,
        payrollNumber: 'test002',
        name: 'Test2',
        trades: [],
        jobPercentage: 100,
      },
    ],
  }

  it('should render operative list, each as an individual link', () => {
    const { asFragment } = render(
      <OperativeList
        workOrderReference={10000621}
        operatives={props.operatives}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
