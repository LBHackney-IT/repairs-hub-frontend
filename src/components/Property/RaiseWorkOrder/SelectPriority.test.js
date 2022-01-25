import { render } from '@testing-library/react'

import SelectPriority from './SelectPriority'

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
        daysToComplete: 60,
        description: '9 [P] PLANNED',
        enabled: true,
        priorityCharacter: 'P',
        priorityCode: 5,
      },
    ],

    priorityCode: '2',
    priorityCodesWithoutDrs: ['5'],
    onPrioritySelect: jest.fn(),
    register: jest.fn(),
  }

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
  it('should render with Info Box', () => {
    const { asFragment } = render(
      <SelectPriority
        priorities={props.priorities}
        onPrioritySelect={props.onPrioritySelect}
        priorityCode="5"
        priorityCodesWithoutDrs={props.priorityCodesWithoutDrs}
        register={props.register}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
