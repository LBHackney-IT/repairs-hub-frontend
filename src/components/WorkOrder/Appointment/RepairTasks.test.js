import { render } from '@testing-library/react'
import RepairTasks from './RepairTasks'

describe('RepairTasks component', () => {
  const props = {
    tasks: [
      {
        code: 'DES5R006',
        description: 'Urgent call outs',
        dateAdded: new Date('2021-02-03T11:33:35.757339'),
        quantity: 2,
        cost: 0,
        status: 'Unknown',
      },
      {
        code: 'DES5R005',
        description: 'Normal call outs',
        dateAdded: new Date('2021-02-03T11:33:35.814437'),
        quantity: 4,
        cost: 0,
        status: 'Unknown',
      },
      {
        code: 'DES5R013',
        description: 'Inspect additional sec entrance',
        dateAdded: new Date('2021-02-03T11:33:35.799566'),
        quantity: 5,
        cost: 0,
        status: 'Unknown',
      },
    ],
  }

  it('should render properly', () => {
    const { asFragment } = render(<RepairTasks tasks={props.tasks} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
