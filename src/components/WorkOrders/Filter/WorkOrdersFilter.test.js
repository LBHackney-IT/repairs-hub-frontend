import { render } from '@testing-library/react'
import WorkOrdersFilter from './WorkOrdersFilter'

describe('WorkOrdersFilter component', () => {
  const props = {
    filters: {
      Priority: [
        {
          key: 'I',
          description: 'Immediate',
        },
        {
          key: 'E',
          description: 'Emergency',
        },
      ],
      Status: [
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
    },
    loading: false,
    register: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <WorkOrdersFilter
        filters={props.filters}
        loading={props.loading}
        register={props.register}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
