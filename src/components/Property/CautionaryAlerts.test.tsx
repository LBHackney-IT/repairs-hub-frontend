import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CautionaryAlerts from './CautionaryAlerts'
import { CautionaryAlert } from '@/models/cautionaryAlerts'

const alerts: CautionaryAlert[] = [
  {
    type: 'VA',
    comments: 'Verbal abuse',
    startDate: '2024-01-01',
    endDate: null,
  },
  {
    type: 'DOG',
    comments: 'Dog on premises',
    startDate: '2024-02-01',
    endDate: null,
  },
]

const specificRequirementsAlert: CautionaryAlert = {
  type: 'SPR',
  comments: 'Specific Requirements',
  startDate: '2024-03-01',
  endDate: null,
  reason: 'Requires an interpreter',
}

describe('CautionaryAlerts component', () => {
  it('shows a spinner while loading', () => {
    render(<CautionaryAlerts alerts={[]} isLoading error={null} />)

    expect(screen.getByText('Fetching alerts…')).toBeInTheDocument()
  })

  it('does not show a spinner when not loading', () => {
    render(<CautionaryAlerts alerts={alerts} error={null} />)

    expect(screen.queryByText('Fetching alerts…')).not.toBeInTheDocument()
  })

  it('shows each alert with its type', () => {
    render(<CautionaryAlerts alerts={alerts} error={null} />)

    const items = screen.getAllByRole('listitem')

    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Verbal abuse (VA)')
    expect(items[1]).toHaveTextContent('Dog on premises (DOG)')
  })

  it('shows the reason for a specific requirements alert', () => {
    render(
      <CautionaryAlerts alerts={[specificRequirementsAlert]} error={null} />
    )

    expect(screen.getByText('Requires an interpreter')).toBeInTheDocument()
  })

  it('does not show the reason for other alerts', () => {
    render(
      <CautionaryAlerts
        alerts={[{ ...alerts[0], reason: 'Shouted at operative' }]}
        error={null}
      />
    )

    expect(screen.queryByText('Shouted at operative')).not.toBeInTheDocument()
  })

  it('does not render a list when there are no alerts', () => {
    render(<CautionaryAlerts alerts={[]} error={null} />)

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('shows the error message when there is an error', () => {
    render(
      <CautionaryAlerts alerts={[]} error="Could not get cautionary alerts" />
    )

    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Could not get cautionary alerts'
    )
  })

  it('does not show an error message when there is no error', () => {
    render(<CautionaryAlerts alerts={alerts} error={null} />)

    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
  })

  describe('expanding a truncated reason', () => {
    beforeEach(() => {
      // jsdom has no layout, so make the reason look like it overflows to
      // get the "show more" link to render
      jest
        .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
        .mockReturnValue(100)
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('limits the width of the list until expanded', async () => {
      render(
        <CautionaryAlerts alerts={[specificRequirementsAlert]} error={null} />
      )

      const list = screen.getByRole('list')

      expect(list).toHaveStyle({ maxWidth: '30em' })

      await userEvent.click(screen.getByText('show more'))

      expect(list).not.toHaveStyle({ maxWidth: '30em' })
    })

    it('limits the width again when collapsed', async () => {
      render(
        <CautionaryAlerts alerts={[specificRequirementsAlert]} error={null} />
      )

      await userEvent.click(screen.getByText('show more'))
      await userEvent.click(screen.getByText('show less'))

      expect(screen.getByRole('list')).toHaveStyle({ maxWidth: '30em' })
    })
  })
})
