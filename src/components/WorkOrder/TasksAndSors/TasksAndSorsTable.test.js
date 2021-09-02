import { render } from '@testing-library/react'
import TasksAndSorsTable from './TasksAndSorsTable'

describe('TasksAndSorsTable component', () => {
  const props = {
    tabName: 'Tasks and SORs',
    originalTasksAndSors: [
      {
        code: 'DES5R006',
        description: 'Urgent call outs',
        dateAdded: new Date('2021-02-03T11:33:35.757339'),
        dateUpdated: null,
        original: true,
        originalQuantity: 1,
        quantity: 2,
        cost: 20.15,
        standardMinuteValue: 10,
      },
    ],
    latestTasksAndSors: [
      {
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

  it('should render properly 2 tables: Latest and Original', () => {
    const { asFragment } = render(
      <TasksAndSorsTable
        originalTasksAndSors={props.originalTasksAndSors}
        latestTasksAndSors={props.latestTasksAndSors}
        tabName={props.tabName}
        tasksWereUpdated={true}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render properly: only Latest table is shown', () => {
    const { asFragment } = render(
      <TasksAndSorsTable
        originalTasksAndSors={props.originalTasksAndSors}
        latestTasksAndSors={props.originalTasksAndSors}
        tabName={props.tabName}
        tasksWereUpdated={false}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
