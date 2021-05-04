import { render } from '@testing-library/react'
import WorkOrdersFilter from './WorkOrdersFilter'

describe('WorkOrdersFilter component', () => {
  const props = {
    priorityFilters: [
      {
        key: 'I',
        description: 'Immediate',
      },
      {
        key: 'E',
        description: 'Emergency',
      },
    ],
    statusFilters: [
      {
        key: '80',
        description: 'In Progress',
      },
      {
        key: '50',
        description: 'Complete',
      },
      {
        key: '30',
        description: 'Work Cancelled',
      },
    ],
    loading: false,
    register: jest.fn(),
    clearFilters: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <WorkOrdersFilter
        statusFilters={props.statusFilters}
        priorityFilters={props.priorityFilters}
        loading={props.loading}
        register={props.register}
        clearFilters={props.clearFilters}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
