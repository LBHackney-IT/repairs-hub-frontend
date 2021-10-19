import { render } from '@testing-library/react'
import OperativeTasksAndSorsTable from './OperativeTasksAndSorsTable'

describe('OperativeTasksAndSorsTable component', () => {
  const props = {
    tabName: 'Tasks and SORs',
    tasksAndSors: [
      {
        id: 1,
        code: 'DES5R006',
        description: 'Urgent call outs',
        dateAdded: new Date('2021-02-03T11:33:35.757339'),
        dateUpdated: null,
        original: true,
        originalQuantity: 2,
        quantity: 2,
        cost: 20.15,
        standardMinuteValue: 25,
      },
      {
        id: 2,
        code: 'DES5R005',
        description: 'Normal call outs',
        dateAdded: new Date('2021-02-03T11:33:35.814437'),
        dateUpdated: new Date('2021-02-03T11:33:35.814437'),
        original: false,
        originalQuantity: null,
        quantity: 4,
        cost: 1.4,
        standardMinuteValue: 30,
      },
      {
        id: 3,
        code: 'DES5R013',
        description: 'Inspect additional sec entrance',
        dateAdded: new Date('2021-02-03T11:33:35.757339'),
        dateUpdated: new Date('2021-02-04T11:33:35.799566'),
        original: true,
        originalQuantity: 3,
        quantity: 5,
        cost: 7.31,
        standardMinuteValue: 15,
      },
    ],
  }

  it('renders tasks and SORs table properly', () => {
    const { asFragment } = render(
      <OperativeTasksAndSorsTable
        tasksAndSors={props.tasksAndSors}
        tabName={props.tabName}
        workOrderReference="10000000"
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
