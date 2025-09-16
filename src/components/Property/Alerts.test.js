import { render } from '@testing-library/react'
import Alerts from './Alerts'

describe('Alerts component', () => {
  it('should render only comment and type when there are not any Specific Requirements alerts', () => {
    const alerts = [
      {
        type: 'OIT',
        comments: 'Other',
        startDate: '12/12/2024',
        endDate: null,
        reason: 'Test',
        alertId: 'a821cd48-8664-4d43-81ab-d5baf689e0c7',
      },
      {
        type: 'OIT',
        comments: 'Hello',
        startDate: '12/12/2024',
        endDate: null,
        reason: 'New Test',
        alertId: 'a821cd48-8664-4d43-81ab-d5baf689e0c9',
      },
    ]
    const { asFragment } = render(
      <Alerts alerts={alerts} setIsExpanded={jest.fn()} isExpanded={false} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should render comment, type and reason for a Specific Requirement alert and comment and type for other alerts', () => {
    const alerts = [
      {
        type: 'OIT',
        comments: 'Other',
        startDate: '12/12/1212',
        endDate: null,
        reason: 'Test',
        alertId: 'a821cd48-8664-4d43-81ab-d5baf689e0c7',
      },
      {
        type: 'SPR',
        comments: 'Specific Requirements',
        startDate: '09/01/2025',
        endDate: null,
        reason:
          'Taking up the whole of the characters to see what it looks like Taking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it looks likeTaking up the whole of the characters to see what it l',
        alertId: '73cf5a20-628e-47a0-9c42-c814e307baf5',
      },
    ]

    const { asFragment } = render(
      <Alerts alerts={alerts} setIsExpanded={jest.fn()} isExpanded={false} />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
