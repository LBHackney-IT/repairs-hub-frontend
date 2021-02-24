import { render } from '@testing-library/react'
import UpdateJobForm from './UpdateJobForm'

describe('UpdateJobForm component', () => {
  const props = {
    propertyReference: '000012345',
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
    addedTasks: [
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
        propertyReference={props.propertyReference}
        tasks={props.tasks}
        addedTasks={props.addedTasks}
        onGetToSummary={props.onGetToSummary}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
