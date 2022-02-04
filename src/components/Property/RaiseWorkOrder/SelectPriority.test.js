import { fireEvent, render } from '@testing-library/react'
import SelectPriority from './SelectPriority'
import { PRIORITY_CODES_WITHOUT_DRS } from '@/utils/helpers/priorities'

describe('SelectPriority component', () => {
  const props = {
    priorities: [
      {
        daysToComplete: 0,
        description: '1 [I] IMMEDIATE',
        enabled: true,
        priorityCharacter: 'I',
        priorityCode: 1,
      },
      {
        daysToComplete: 1,
        description: '2 [E] EMERGENCY',
        enabled: true,
        priorityCharacter: 'E',
        priorityCode: 2,
      },
      {
        daysToComplete: 5,
        description: '4 [U] URGENT',
        enabled: true,
        priorityCharacter: 'U',
        priorityCode: 3,
      },
      {
        daysToComplete: 21,
        description: '5 [N] NORMAL',
        enabled: true,
        priorityCharacter: 'N',
        priorityCode: 4,
      },
      {
        daysToComplete: 30,
        description: '9 [P] PLANNED',
        enabled: true,
        priorityCharacter: 'P',
        priorityCode: 9,
      },
    ],

    priorityCode: 2,
    priorityCodesWithoutDrs: PRIORITY_CODES_WITHOUT_DRS,
    onPrioritySelect: jest.fn(),
    register: jest.fn(),
  }

  it('should render with Info Box when Planned priority is selected', () => {
    const { asFragment, queryByText, getByTestId } = render(
      <SelectPriority
        priorities={props.priorities}
        onPrioritySelect={props.onPrioritySelect}
        priorityCode={props.priorityCode}
        priorityCodesWithoutDrs={props.priorityCodesWithoutDrs}
        register={props.register}
      />
    )
    fireEvent.change(getByTestId('priorityCode'), { target: { value: 9 } })
    expect(asFragment()).toMatchSnapshot()
    expect(
      queryByText('Planned work orders do not go to the DRS booking system')
    ).toBeInTheDocument()
  })

  it('should render without Info Box', () => {
    const { asFragment } = render(
      <SelectPriority
        priorities={props.priorities}
        onPrioritySelect={props.onPrioritySelect}
        priorityCode={props.priorityCode}
        priorityCodesWithoutDrs={props.priorityCodesWithoutDrs}
        register={props.register}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('should render with Info Box when task priority in Planned by default', () => {
    const { asFragment, queryByText } = render(
      <SelectPriority
        priorities={props.priorities}
        onPrioritySelect={props.onPrioritySelect}
        priorityCode={9}
        priorityCodesWithoutDrs={props.priorityCodesWithoutDrs}
        register={props.register}
      />
    )

    expect(asFragment()).toMatchSnapshot()
    expect(
      queryByText('Planned work orders do not go to the DRS booking system')
    ).toBeInTheDocument()
  })
})
