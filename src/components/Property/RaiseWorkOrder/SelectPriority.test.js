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
      {
        daysToComplete: 30,
        description: '[V30] Voids major',
        enabled: true,
        priorityCharacter: 'V30',
        priorityCode: 30,
      },
      {
        daysToComplete: 15,
        description: '[V15] Voids minor',
        enabled: true,
        priorityCharacter: 'V15',
        priorityCode: 15,
      },
      {
        daysToComplete: 20,
        description: '[AD20] Minor Adaptation',
        enabled: true,
        priorityCharacter: 'AD20',
        priorityCode: 200,
      },
      {
        daysToComplete: 30,
        description: '[AD30] Intermediate Adaptation',
        enabled: true,
        priorityCharacter: 'AD30',
        priorityCode: 300,
      },
      {
        daysToComplete: 17,
        description: '[AD17] Major Adaptation',
        enabled: true,
        priorityCharacter: 'AD17',
        priorityCode: 170,
      },
    ],

    priorityCode: 2,
    onPrioritySelect: jest.fn(),
    register: jest.fn(),
  }

  it('should render with Info Box when Planned priority is selected', () => {
    const { asFragment, queryByText, getByTestId } = render(
      <SelectPriority
        priorities={props.priorities}
        onPrioritySelect={props.onPrioritySelect}
        priorityCode={props.priorityCode}
        register={props.register}
        errors={{}}
        isPriorityEnabled={false}
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
        register={props.register}
        errors={{}}
        isPriorityEnabled={false}
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
        register={props.register}
        errors={{}}
        isPriorityEnabled={false}
      />
    )

    expect(asFragment()).toMatchSnapshot()
    expect(
      queryByText('Planned work orders do not go to the DRS booking system')
    ).toBeInTheDocument()
  })
  it('should render with Info Box when VOIDS priority is selected', () => {
    const { asFragment, queryByText, getByTestId } = render(
      <SelectPriority
        priorities={props.priorities}
        onPrioritySelect={props.onPrioritySelect}
        priorityCode={props.priorityCode}
        register={props.register}
        errors={{}}
        isPriorityEnabled={false}
      />
    )
    fireEvent.change(getByTestId('priorityCode'), { target: { value: 15 } })
    expect(asFragment()).toMatchSnapshot()
    expect(
      queryByText('VOIDS work orders do not go to the DRS booking system')
    ).toBeInTheDocument()
  })

  it('should render with Info Box when Adaptation priority is selected', () => {
    const { asFragment, queryByText, getByTestId } = render(
      <SelectPriority
        priorities={props.priorities}
        onPrioritySelect={props.onPrioritySelect}
        priorityCode={props.priorityCode}
        register={props.register}
        errors={{}}
        isPriorityEnabled={false}
      />
    )
    fireEvent.change(getByTestId('priorityCode'), { target: { value: 200 } })
    expect(asFragment()).toMatchSnapshot()
    expect(
      queryByText('Adaptation work orders do not go to the DRS booking system')
    ).toBeInTheDocument()
  })
})
