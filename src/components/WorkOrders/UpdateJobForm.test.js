import { render } from '@testing-library/react'
import UpdateJobForm from './UpdateJobForm'

describe('UpdateJobForm component', () => {
  const props = {
    tasks: [
      {
        code: 'DES5R006',
        quantity: 2,
      },
      {
        code: 'DES5R005',
        quantity: 1,
      },
    ],
    sorCodes: [
      {
        code: '20000030',
        shortDescription: 'DAYWORK PLUMBER BAND 3',
        priority: {
          priorityCode: 4,
          description: '5 [N] NORMAL',
        },
      },
      {
        code: '20060020',
        shortDescription: 'BATHROOM PLUMBING REPAIRS',
        priority: {
          priorityCode: 4,
          description: '5 [N] NORMAL',
        },
      },
    ],
    rateScheduleItems: [
      {
        code: 'DES5R004',
        quantity: 2,
      },
    ],
    onGetToSummary: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <UpdateJobForm
        tasks={props.tasks}
        rateScheduleItems={props.rateScheduleItems}
        sorCodes={props.sorCodes}
        onGetToSummary={props.onGetToSummary}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
