import { render } from '@testing-library/react'

import SelectPriority from './SelectPriority'

describe('SelectPriority component', () => {
  const props = {
    priorityList: [
      { value: '1', text: '1 [I] IMMEDIATE' },
      { value: '2', text: '2 [E] EMERGENCY' },
      { value: '3', text: '4 [U] URGENT' },
      { value: '4', text: '5 [N] NORMAL' },
      { value: '5', text: '9 [P] PLANNED' },
    ],

    priorityCode: '2',
    priorityCodesWithoutDrs: ['5'],
    onPrioritySelect: jest.fn(),
    register: jest.fn(),
  }

  it('should render without Info Box', () => {
    const { asFragment } = render(
      <SelectPriority
        priorityList={props.priorityList}
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
        priorityList={props.priorityList}
        onPrioritySelect={props.onPrioritySelect}
        priorityCode="5"
        priorityCodesWithoutDrs={props.priorityCodesWithoutDrs}
        register={props.register}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
